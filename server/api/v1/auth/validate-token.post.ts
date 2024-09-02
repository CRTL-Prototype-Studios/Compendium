
import { PrismaClient } from '@prisma/client'

//@ts-ignore
import jwt from "jsonwebtoken";
const prisma = new PrismaClient()
export default defineEventHandler(async (event) => {
    // const prisma = usePrismaClient()
    const {token} = await readBody(event)
    if (!token) {
        return sendError(event, createError({ statusCode: 403, statusMessage: 'token is required' }));
    }

    try{
        const decoded = jwt.decode(token) as {uuid: string};

        if (!decoded || !decoded.uuid) {
            return sendError(event, createError({ statusCode: 403, statusMessage: 'Invalid token' }));
        }

        const data = await prisma.token.findFirst({
            where: {
                uuid: decoded.uuid
            }
        })

        if(!data)
            return {valid: false, data}

        // console.log(!!data + " validate")
        return {valid: !!data, data}
    } catch (error) {
        console.error('Error validating token:', error);
        return sendError(event, createError({ statusCode: 500, statusMessage: 'Error validating token' }));
    }
})