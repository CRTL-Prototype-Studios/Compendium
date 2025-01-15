// server/api/media/delete-batch.post.ts

import * as fs from "node:fs/promises";
import * as path from "node:path";
// import { useInstantDBAdmin } from "~~/server/utils/useInstantDBAdmin";

export default defineEventHandler(async (event) => {
	const { ids, data } = await readBody(event);
	// const $db = useInstantDBAdmin();

	if (!Array.isArray(ids) || ids.length === 0) {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid or empty ids array",
		});
	}

	try {
		// const data = await $db.db.query({
		// 	files: {
		// 		$: {
		// 			where: {
		// 				id: {
		// 					$in: ids,
		// 				},
		// 			},
		// 		},
		// 	},
		// });

		if (!data || data.files.length <= 0) {
			throw new Error("No files/folders present at the selected directories");
		}

		for (const item of data.files) {
			const fullPath = path.join(process.cwd(), item.url as string);
			if (item.directory) {
				await fs.rm(fullPath, { recursive: true, force: true });
			} else {
				await fs.unlink(fullPath);
			}
		}

		let transactions = [];
		for (const i of ids) {
			// transactions.push($db.db.tx.files[i].delete());
			transactions.push(i)
		}
		// await $db.db.transact(transactions);

		// return { success: true, message: `Deleted ${data.files.length} item(s).` };
		return transactions;
	} catch (error) {
		console.error("Error deleting batch:", error);
		throw createError({
			statusCode: 500,
			statusMessage: "Error deleting batch",
		});
	}
});
