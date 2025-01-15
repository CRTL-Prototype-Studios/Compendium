// import { useInstantDBAdmin } from "~~/server/utils/useInstantDBAdmin";

interface StructuredMedia {
	[key: string]: {
		files: any[];
		folders: StructuredMedia;
	};
}

export default defineEventHandler(async (event) => {
	// const $db = useInstantDBAdmin();
	// const prisma = usePrismaClient()

	const {data} = await readBody(event)
	try {
		// const data = await $db.db.query({
		// 	files: {
		// 		$: {
		// 			order: {
		// 				created_at: "desc",
		// 			},
		// 		},
		// 	},
		// });

		const structuredResult: StructuredMedia = {
			"/": { files: [], folders: {} },
		};

		for (const item of data.files) {
			const pathParts = (item.path as string).split("/").filter(Boolean);
			let currentLevel = structuredResult["/"];

			for (const part of pathParts) {
				if (!currentLevel.folders[part]) {
					currentLevel.folders[part] = { files: [], folders: {} };
				}
				currentLevel = currentLevel.folders[part];
			}

			if (item.directory) {
				if (!currentLevel.folders[item.fileName as string]) {
					currentLevel.folders[item.fileName as string] = { files: [], folders: {} };
				}
			} else {
				currentLevel.files.push(item);
			}
		}

		return structuredResult;
	} catch (error) {
		console.error("Error fetching media:", error);
		throw createError({
			statusCode: 500,
			statusMessage: "Error fetching media.",
		});
	}
});
