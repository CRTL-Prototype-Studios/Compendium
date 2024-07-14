// server/api/media/move-batch.post.ts

// import { PrismaClient } from '@prisma/client'
import * as fs from 'node:fs/promises'
import * as path from 'node:path'

// const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const { ids, destination } = await readBody(event)
    const prisma = usePrismaClient()

    if (!Array.isArray(ids) || ids.length === 0 || typeof destination !== 'string') {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid input',
        })
    }

    try {
        const mediaItems = await prisma.media.findMany({
            where: { id: { in: ids } }
        })

        for (const item of mediaItems) {
            const oldPath = path.join(process.cwd(), item.url)
            const newPath = path.join(process.cwd(), 'media', destination, path.basename(item.url))

            await fs.rename(oldPath, newPath)

            await prisma.media.update({
                where: { id: item.id },
                data: {
                    directory: destination,
                    url: path.join(destination, path.basename(item.url))
                }
            })
        }

        return { success: true, message: `Moved ${mediaItems.length} item(s) to ${destination}.` }
    } catch (error) {
        console.error('Error moving batch:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Error moving batch',
        })
    }
})