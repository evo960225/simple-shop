import { PrismaClient } from '@prisma/client'

import db from '@/server/db'
import jwt from 'jsonwebtoken'
const prisma = new PrismaClient()
const runtimeConfig = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  const managerData = await db.manager.login(body.email, body.password)
  if (!managerData) {
    throw createError({
      statusCode: 400,
      statusMessage: 'not found user data!'
    })
  }

  const maxAge = 60 * 60 * 24 * 7
  const expires = Math.floor(Date.now() / 1000) + maxAge

  setCookie(event, 'access_token_backstage', managerData.loginToken, {
    httpOnly: true,
    maxAge,
    expires: new Date(expires * 1000),
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  })

  return managerData  
})


