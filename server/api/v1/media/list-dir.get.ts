// server/api/media/listDirectory.get.ts

// import { PrismaClient } from '@prisma/client'
import path from "node:path";

// const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const prisma = usePrismaClient()

    // Sample input: directory is "Images", or "Images/AnotherFolder", or ""
    const directory = ((query.directory as string) === '' ? '/' : (query.directory as string)) || '/'

    try {
        const mediaItems = await prisma.media.findMany({
            where: {
                pseudoDirectory: directory === '' ? '/' : directory
            }
        });

        const result = {
            currentDirectory: directory,
            parentDirectory: directory === '/' ? null : directory.split('/').slice(0, -1).join('/') || '/',
            items: mediaItems
        };
        return result;
    } catch (error) {
        console.error('Error fetching directory contents:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Error fetching directory contents.',
        });
    }
});