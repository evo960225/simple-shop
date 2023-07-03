import { PrismaClient } from '@prisma/client'

import db from '@/server/db'
import jwt from 'jsonwebtoken'
const prisma = new PrismaClient()
const runtimeConfig = useRuntimeConfig()

export default defineEventHandler(async (event) => {

  const user = event.context?.auth?.user
  
  if (!user?.id) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }


  const { email, oldPassword, newPassword } = await readBody(event)
  const userData = await db.user.verifyPasswordByEmail(email, oldPassword)
  if (!userData) {
    throw createError({
      statusCode: 400,
      statusMessage: 'not found user data!'
    })
  }
  
  const updatedUser = db.user.updatePassword(userData.id, newPassword)
  if (!updatedUser) {
    throw createError({
      statusCode: 500,
      statusMessage: 'update error!'
    })
  }
  return updatedUser  
})


