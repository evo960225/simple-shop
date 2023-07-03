import db from '@/server/db'
import { PrismaClient } from '@prisma/client'
import fs from 'node:fs'
import https from 'https'
import bcrypt from 'bcryptjs'
const prisma = new PrismaClient()

export default defineEventHandler((event) => {
  if (!event.context.auth && !event.context.authBackstage) {
    return createError({
      statusCode: 401,
      message: 'You don\'t have the rights to access this resource',
    })
  } 
  const runtimeConfig = useRuntimeConfig()
  const gameId = parseInt(event.context.params.gameId)
  const fileName = decodeURIComponent(event.context.params.fileName);

  const publicDir = runtimeConfig.publicDir
  const gameFilesDir = `${publicDir}/games/${gameId}`

  return sendStream(event, fs.createReadStream(`${gameFilesDir}/${fileName}`))
})
