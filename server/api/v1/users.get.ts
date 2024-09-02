import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const {data, error} = await prisma.user.findMany()

    if(error) {
        console.error('Error fetching media: ', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Something went wrong while fetching users.',
        })
    }

    return data;
})