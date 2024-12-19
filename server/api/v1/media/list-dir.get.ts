// server/api/media/listDirectory.get.ts
import path from "node:path";
import { useInstantDB } from "~/composables/useInstantDB";

export default defineEventHandler(async (event) => {
	const query = getQuery(event);
	const $db = useInstantDB();
	// const prisma = usePrismaClient()

	// Sample input: directory is "Images", or "Images/AnotherFolder", or ""
	const directory =
		((query.directory as string) === "" ? "/" : (query.directory as string)) ||
		"/";

	try {
		const { data, pageInfo } = await $db.db.queryOnce({
			files: {
				$: {
					where: {
						pseudoDir: directory === "" ? "/" : directory,
					},
				},
			},
		});

		const result = {
			currentDirectory: directory,
			parentDirectory:
				directory === "/"
					? null
					: directory.split("/").slice(0, -1).join("/") || "/",
			items: data.files,
		};
		return result;
	} catch (error) {
		console.error("Error fetching directory contents:", error);
		throw createError({
			statusCode: 500,
			statusMessage: "Error fetching directory contents.",
		});
	}
});
