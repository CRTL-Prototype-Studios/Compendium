import * as fs from 'node:fs/promises';
import * as path from 'node:path';
// import {PrismaClient} from "@prisma/client";
// const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const { sourcePath, sourceId, destPath } = await readBody(event);
    const header = getHeader(event, 'Authorization');
    const prisma = usePrismaClient()

    if (!header) {
        throw createError({
            statusMessage: 'Unauthorized, please re-login.',
            statusCode: 403
        });
    }

    if (!sourcePath || !destPath) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Source and destination paths are required.',
        });
    }

    const fullSourcePath = path.join(process.cwd(), 'media', sourcePath);
    const fullDestPath = path.join(process.cwd(), 'media', destPath);

    try {
        await fs.rename(fullSourcePath, fullDestPath);

        await prisma.media.update({
            where: {
                id: sourceId as number
            },
            data: {
                directory: destPath,
                fileName: destPath.split('/')[destPath.length - 1]
            }
        })

        return { success: true, message: `Moved from ${sourcePath} to ${destPath}` };
    } catch (error) {
        console.error('Error moving file/directory:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Error moving file/directory.',
        });
    }
});