import { OAuth2Client } from 'google-auth-library'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import db from '@/server/db'

const prisma = new PrismaClient()
const runtimeConfig = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  
  const { googleClientSecret, recaptchaSecretKey, jwtSignSecret } = runtimeConfig
  const { googleClientId: GOOGLE_CLIENT_ID, host } = runtimeConfig.public
  const body = await readBody(event)
  const oauth2Client = new OAuth2Client({
    clientId: GOOGLE_CLIENT_ID,
    clientSecret: googleClientSecret,
    redirectUri: host
  })

  // 驗證 recaptcha
  const recaptchaResult = await $fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecretKey}&response=${body.recaptchaToken}`);
  if (!recaptchaResult.success) throw createError({
    statusCode: 400,
    statusMessage: 'recaptcha not success!'
  })


  // get token
  const { tokens } = await oauth2Client.getToken(body.code)
  oauth2Client.setCredentials({ access_token: tokens.access_token })

  
  const userInfo = await oauth2Client
    .request({
      url: 'https://www.googleapis.com/oauth2/v3/userinfo'
    })
    .then((response) => response.data)
    .catch(() => null)

  oauth2Client.revokeCredentials() 

  if (!userInfo) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid token'
    })
  }

  let userRecord = await db.user.getUserInfoByEmail({
    email: userInfo.email
  })

  if (!userRecord) {
    throw createError({
      statusCode: 400,
      statusMessage: 'not found user data!'
    })
  }

  const maxAge = 60 * 60 * 24 * 1
  const expires = Math.floor(Date.now() / 1000) + maxAge
  const jwtToken = jwt.sign(
    {
      exp: expires,
      data: { id: userRecord.id }
    },
    runtimeConfig.jwtSignSecret
  )

  db.user.loginByGoogle(userRecord.id, jwtToken)

  setCookie(event, 'access_token', jwtToken, {
    httpOnly: true,
    maxAge,
    expires: new Date(expires * 1000),
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  })


  return userRecord
  
})


