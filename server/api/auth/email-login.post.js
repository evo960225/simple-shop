import { OAuth2Client } from 'google-auth-library'
import { PrismaClient } from '@prisma/client'

import db from '@/server/db'
import jwt from 'jsonwebtoken'
const prisma = new PrismaClient()
const runtimeConfig = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const userRecord = await db.user.verifyPasswordByEmail(body.email, body.password)
  if (!userRecord) {
    throw createError({
      statusCode: 400,
      statusMessage: 'not found user data!'
    })
  }

  const maxAge = runtimeConfig.loginMaxAge  
  const expires = Math.floor(Date.now() / 1000) + maxAge

  const jwtToken = jwt.sign(
    {
      exp: expires,
      data: { id: userRecord.id }
    },
    runtimeConfig.jwtSignSecret
  )

  await db.user.saveToken(userRecord.id, jwtToken)

  setCookie(event, 'access_token', jwtToken, {
    httpOnly: true,
    maxAge,
    expires: new Date(expires * 1000),
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  })

  return userRecord  
})


