import { $fetch } from "ofetch";
import type { File as SchemaFile } from "~/instant.schema.types";
import path from "node:path";

export default function useInstantMediaLibrary() {
	const config = useRuntimeConfig();
	const $db = useInstantDB()

	const createDirectory = async (targetPath: string, folderName: string) => {
		return useFetch("/api/v1/media/new-dir", {
			method: "POST",
			body: { targetPath: targetPath, folderName: folderName },
			headers: {
				Authorization: useCookie("session_token").value || "",
			},
		});
	};

	const moveFile = async (sourcePath: string, destPath: string) => {
		return useFetch("/api/v1/media/move", {
			method: "POST",
			body: { sourcePath, destPath },
		});
	};

	const deleteFile = async (targetPath: string, targetId: string) => {
		const fullPath = path.join(process.cwd(), "media", targetPath);

		let psuedoDir = "";

		let spl = targetPath.split("/");
		for (let i = 0; i < spl.length - 1; i++) {
			psuedoDir = path.join(psuedoDir, spl[i] as string);
		}
		const filesData = await $db.db.queryOnce({
			files: {
				$: {
					where: {
						id: targetId,
						pseudoDir: psuedoDir,
					},
				},
			},
		});
		const data = await $fetch("/api/v1/media/delete", {
			method: "POST",
			body: { targetPath, data: filesData },
		});
		return await $db.db.transact([
			$db.db.tx.files[targetId]?.delete()
		])
	};

	const uploadFile = async (file: File, path: string) => {
		const formData = new FormData();
		formData.append("file", file);

		const {waitAuth, userValid, user} = useInstantAuth()
		await waitAuth()
		if(!userValid.value || user.value?.id == undefined)
			throw Error("Unable to upload file: no user permissions")
		const {data:filedata} = await $db.db.queryOnce({
			$users: {
				$: {
					order: {
						serverCreatedAt: 'asc'
					},
					limit: 1
				}
			}
		})

		if(filedata.$users[0]?.id != user.value.id)
			throw Error("Unable to upload file: no site-owner permissions")

		const data = await $fetch("/api/v1/media/upload", {
			method: "POST",
			body: formData,
			query: {
				targetPath: path,
			},
			headers: {
				Authorization: user.value.id,
			},
		});

		const id = $db.id()
		return await $db.db.transact([
			$db.db.tx.files[id].update(data)
		])
	};

	const getMediaUrl = (media: SchemaFile) => {
		return `${config.public.siteUrl}${media.path}`;
	};

	const listMedia = async () => {
		const data = await $db.db.queryOnce({
			files: {
				$: {
					order: {
						created_at: "desc",
					},
				},
			},
		});
		return await $fetch("/api/v1/media/list", {
			method: 'POST',
			body: {
				data
			}
		});
	};

	const listDirectory = async (
		directory: string = "",
	) => {
		const filesData = await $db.db.queryOnce({
			files: {
				$: {
					where: {
						pseudoDir: directory === "" ? "/" : directory,
					},
				},
			},
		});
		return await $fetch("/api/v1/media/list-dir", {
			method: 'POST',
			query: {
				directory: directory,
			},
			body: {
				data: filesData
			}
		});
	};

	const deleteBatch = async (ids: string[]) => {
		const filesData = await $db.db.queryOnce({
			files: {
				$: {
					where: {
						id: {
							$in: ids,
						},
					},
				},
			},
		});
		const data = await $fetch(
			"/api/v1/media/delete-batch",
			{
				method: "POST",
				body: { ids, data: filesData },
			},
		);
		let transactions = []
		for(const i of data)
			transactions.push($db.db.tx.files[i as string].delete())
		return await $db.db.transact(transactions)
	};

	const moveBatch = async (ids: string[], destination: string) => {
		const filesData = await $db.db.queryOnce({
			files: {
				$: {
					where: {
						id: {
							$in: ids,
						},
					},
				},
			},
		});
		const data = await $fetch(
			"/api/v1/media/move-batch",
			{
				method: "POST",
				body: { ids, destination, data: filesData },
			},
		);
		let transactions = []
		for(const i of data)
			transactions.push($db.db.tx.files[i.id].update(i))
		return await $db.db.transact(transactions)
	};

	return {
		createDirectory,
		moveFile,
		deleteFile,
		uploadFile,
		getMediaUrl,
		listMedia,
		listDirectory,
		deleteBatch,
		moveBatch,
	};
}
