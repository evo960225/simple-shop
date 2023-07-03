import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import db from '@/server/db'

export default defineEventHandler(async(event) => {

    const methodList = await db.shippingMethod.getAll()

    if (!methodList) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Could not find shipping method.'
        })
    }

    return methodList
    
})