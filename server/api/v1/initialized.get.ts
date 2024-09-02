import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    try {
        const data = await prisma.user.findMany()

        return data.length > 0;
    } catch (error) {
        console.error('Error fetching media: ', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Something went wrong while fetching users.',
        })
    }
})