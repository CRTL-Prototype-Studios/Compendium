// server/api/media/move-batch.post.ts

import * as fs from "node:fs/promises";
import * as path from "node:path";
import { useInstantDB } from "~/composables/useInstantDB";

export default defineEventHandler(async (event) => {
	const { ids, destination } = await readBody(event);
	const $db = useInstantDB();
	// const prisma = usePrismaClient()

	if (
		!Array.isArray(ids) ||
		ids.length === 0 ||
		typeof destination !== "string"
	) {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid input",
		});
	}

	try {
		const { data, pageInfo } = await $db.db.queryOnce({
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

		let transactions = [];

		for (const i of data.files) {
			const oldPath = path.join(process.cwd(), i.url as string);
			const newPath = path.join(
				process.cwd(),
				"media",
				destination,
				path.basename(i.url as string),
			);

			await fs.rename(oldPath, newPath);
			transactions.push(
				$db.db.tx.files[i.id].update({
					path: destination,
					url: path.join(destination, path.basename(i.url as string)),
				}),
			);
		}

		await $db.db.transact(transactions);

		return {
			success: true,
			message: `Moved ${data.files.length} item(s) to ${destination}.`,
		};
	} catch (error) {
		console.error("Error moving batch:", error);
		throw createError({
			statusCode: 500,
			statusMessage: "Error moving batch",
		});
	}
});
