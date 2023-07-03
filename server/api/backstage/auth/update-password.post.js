import { PrismaClient } from '@prisma/client'

import db from '@/server/db'
import jwt from 'jsonwebtoken'
const prisma = new PrismaClient()
const runtimeConfig = useRuntimeConfig()

export default defineEventHandler(async (event) => {

  const manager = event.context?.authBackstage?.manager
  
  if (!manager?.id) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }


  const { email, oldPassword, newPassword } = await readBody(event)
  const { managerData } = await db.manager.verifyPassword(email, oldPassword)
  if (!managerData) {
    throw createError({
      statusCode: 400,
      statusMessage: 'not found user data!'
    })
  }
  const updatedManager = db.manager.updatePassword(managerData.id, newPassword)
  if (!updatedManager) {
    throw createError({
      statusCode: 500,
      statusMessage: 'update error!'
    })
  }
  return updatedManager  
})


