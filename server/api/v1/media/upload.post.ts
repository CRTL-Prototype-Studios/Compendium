import { randomUUID } from "node:crypto";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { target } from "@vue/devtools-shared";
import { useInstantDBAdmin } from "~~/server/utils/useInstantDBAdmin";

export default defineEventHandler(async (event) => {
	const form = await readMultipartFormData(event);
	const header = getHeader(event, "Authorization");
	const query = getQuery(event);
	const targetPath = query.targetPath as string;
	// Sample input: target directory is "Images", or "Images/AnotherFolder", or ""; default value is ""
	const config = useRuntimeConfig();
	const $db = useInstantDBAdmin();

	// const prisma = usePrismaClient()

	const processPseudoDir = (input: string) => {
		if (input === "") {
			return "/";
		} else {
			return input;
		}
	};

	if (!header) {
		throw createError({
			statusMessage: "Unauthorized, please re-login.",
			statusCode: 403,
		});
	}

	if (!form?.at(0)?.data || !form?.at(0)?.filename) {
		throw createError({
			statusCode: 400,
			statusMessage: "No file or name identifier provided.",
		});
	}

	// Generate a unique filename
	const fileExtension = path.extname(form?.at(0)?.filename || "");
	const uniqueFilename = `${randomUUID()}${fileExtension}`;

	// Define the media directory and ensure it exists
	const mediaDir = path.join(process.cwd(), "media", targetPath);
	await fs.mkdir(mediaDir, { recursive: true });

	// Define the file path
	const nativeFilePath = path.join(mediaDir, uniqueFilename);

	try {
		// Write the file to the server
		await fs.writeFile(nativeFilePath, form?.at(0)?.data as any as Buffer);

		// Generate a permalink
		const permalink = `/${path.join("media", path.join(targetPath, uniqueFilename))}`;
		console.log(permalink);

		const id = $db.id();
		await $db.db.transact([
			$db.db.tx.files[id].update({
				fileName: uniqueFilename,
				url: permalink,
				path: nativeFilePath,
				pseudoDir: processPseudoDir(targetPath),
			}),
		]);

		return {
			success: true,
			permalink: permalink,
		};
	} catch (error) {
		console.error("Error saving file:", error);
		throw createError({
			statusCode: 500,
			statusMessage: "Error saving file.",
		});
	}
});

interface MediaFile {
	file: Promise<ArrayBuffer>;
	name: string;
}
