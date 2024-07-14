// server/api/media/list.get.ts

// import { PrismaClient } from '@prisma/client'
//
// const prisma = new PrismaClient()

interface StructuredMedia {
    [key: string]: {
        files: any[];
        folders: StructuredMedia;
    };
}

export default defineEventHandler(async (event) => {
    const prisma = usePrismaClient()
    try {
        const mediaItems = await prisma.media.findMany({
            orderBy: [
                { isFolder: 'desc' },
                { fileName: 'asc' }
            ]
        });

        const structuredResult: StructuredMedia = { '/': { files: [], folders: {} } };

        for (const item of mediaItems) {
            const pathParts = item.directory.split('/').filter(Boolean);
            let currentLevel = structuredResult['/'];

            for (const part of pathParts) {
                if (!currentLevel.folders[part]) {
                    currentLevel.folders[part] = { files: [], folders: {} };
                }
                currentLevel = currentLevel.folders[part];
            }

            if (item.isFolder) {
                if (!currentLevel.folders[item.fileName]) {
                    currentLevel.folders[item.fileName] = { files: [], folders: {} };
                }
            } else {
                currentLevel.files.push(item);
            }
        }

        return structuredResult;
    } catch (error) {
        console.error('Error fetching media:', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Error fetching media.',
        });
    }
});