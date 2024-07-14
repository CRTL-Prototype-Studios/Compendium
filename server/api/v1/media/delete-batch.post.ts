// server/api/media/delete-batch.post.ts

import { PrismaClient } from '@prisma/client'
import * as fs from 'node:fs/promises'
import * as path from 'node:path'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const { ids } = await readBody(event)

    if (!Array.isArray(ids) || ids.length === 0) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid or empty ids array',
        })
    }

    try {
        const mediaItems = await prisma.media.findMany({
            where: { id: { in: ids } }
        })

        if(mediaItems.length === 0) {
            throw new Error("No files/folders present at the selected directories")
        }

        for (const item of mediaItems) {
            const fullPath = path.join(process.cwd(), item.url)
            if (item.isFolder) {
                await fs.rm(fullPath, { recursive: true, force: true })
            } else {
                await fs.unlink(fullPath)
            }
        }

        await prisma.media.deleteMany({
            where: { id: { in: ids } }
        })

        return { success: true, message: `Deleted ${mediaItems.length} item(s).` }
    } catch (error) {
        console.error('Error deleting batch:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Error deleting batch',
        })
    }
})