import db from '@/server/db'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async(event) => {
  const body = await readBody(event)
  db.user.createUser({
    nickname: body.nickname,
    email: body.email,
    password: body.email,
  })
  
})