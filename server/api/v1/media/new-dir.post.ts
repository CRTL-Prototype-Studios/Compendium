import * as fs from "node:fs/promises";
import * as path from "node:path";

export default defineEventHandler(async (event) => {
	const processFolderName = (input: string) => {
		let temp = input.split("/");
		if (temp.length > 1) {
			return temp.at(temp.length - 1) as string;
		}
		return input;
	};
	const processPseudoDir = (input: string) => {
		if (input === "") {
			return "/";
		} else {
			return input;
		}
	};

	const { targetPath, folderName } = await readBody(event);
	const header = getHeader(event, "Authorization");

	// Sample input: targetPath is "Images", or "Images/AnotherFolder", or ""
	if (!header) {
		throw createError({
			statusMessage: "Unauthorized, please re-login.",
			statusCode: 403,
		});
	}

	if (targetPath == null) {
		throw createError({
			statusCode: 400,
			statusMessage: "No directory path provided.",
		});
	}

	const fullPath = path.join(process.cwd(), "media", targetPath);
	const permalink = `/${path.join("media", path.join(targetPath, folderName))}`;

	try {
		await fs.mkdir(fullPath, { recursive: true });
		// const id = $db.id();
		// await $db.db.transact([
		// 	$db.db.tx.files[id].update({
		// 		url: permalink,
		// 		fileName: folderName,
		// 		path: fullPath,
		// 		directory: true,
		// 		pseudoDir: processPseudoDir(targetPath),
		// 	}),
		// ]);

		return {
			url: permalink,
			fileName: folderName,
			path: fullPath,
			directory: true,
			pseudoDir: processPseudoDir(targetPath),
		};
	} catch (error) {
		console.error("Error creating directory:", error);
		throw createError({
			statusCode: 500,
			statusMessage: "Error creating directory.",
		});
	}
});
