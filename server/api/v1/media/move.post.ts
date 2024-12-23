import * as fs from "node:fs/promises";
import * as path from "node:path";
import { useInstantDB } from "~/composables/useInstantDB";

export default defineEventHandler(async (event) => {
	const { sourcePath, sourceId, destPath } = await readBody(event);
	const header = getHeader(event, "Authorization");
	const $db = useInstantDB();
	// const prisma = usePrismaClient()

	if (!header) {
		throw createError({
			statusMessage: "Unauthorized, please re-login.",
			statusCode: 403,
		});
	}

	if (!sourcePath || !destPath) {
		throw createError({
			statusCode: 400,
			statusMessage: "Source and destination paths are required.",
		});
	}

	const fullSourcePath = path.join(process.cwd(), "media", sourcePath);
	const fullDestPath = path.join(process.cwd(), "media", destPath);

	try {
		await fs.rename(fullSourcePath, fullDestPath);

		await $db.db.transact([
			$db.db.tx.files[sourceId as string].update({
				path: destPath,
				fileName: destPath.split("/")[destPath.length - 1],
			}),
		]);

		return {
			success: true,
			message: `Moved from ${sourcePath} to ${destPath}`,
		};
	} catch (error) {
		console.error("Error moving file/directory:", error);
		throw createError({
			statusCode: 500,
			statusMessage: "Error moving file/directory.",
		});
	}
});
