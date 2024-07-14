import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import {PrismaClient} from "@prisma/client";
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const { targetPath, targetId } = await readBody(event);
    const header = getHeader(event, 'Authorization');

    if (!header) {
        throw createError({
            statusMessage: 'Unauthorized, please re-login.',
            statusCode: 403
        });
    }

    if (!targetPath) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Target path is required.',
        });
    }

    const fullPath = path.join(process.cwd(), 'media', targetPath);

    let psuedoDir = '';

    let spl = targetPath.split('/')
    for(let i = 0; i < spl.length - 1; i++) {
        psuedoDir = path.join(psuedoDir, spl[i]);
    }

    try {
        const data = await prisma.media.delete({
            where: {
                id: targetId as number,
                pseudoDirectory: psuedoDir,
            }
        })

        if(!data)
            throw new Error(`No file/folder at directory ${targetPath}`)

        const stats = await fs.stat(fullPath);
        if (stats.isDirectory()) {
            await fs.rm(fullPath, { recursive: true, force: true });
        } else {
            await fs.unlink(fullPath);
        }
        return { success: true, message: `Deleted: ${targetPath}` };
    } catch (error) {
        console.error('Error deleting file/directory:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Error deleting file/directory.',
        });
    }
});