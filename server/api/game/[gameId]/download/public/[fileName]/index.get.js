import db from '@/server/db'
import { PrismaClient } from '@prisma/client'
import fs from 'node:fs'
import bcrypt from 'bcryptjs'
const prisma = new PrismaClient()

export default defineEventHandler((event) => {

  const runtimeConfig = useRuntimeConfig()
  const gameId = parseInt(event.context.params.gameId)
  const fileName = decodeURIComponent(event.context.params.fileName);

  const publicDir = runtimeConfig.publicDir
  const gameFilesDir = `${publicDir}/games/${gameId}/public`

  return sendStream(event, fs.createReadStream(`${gameFilesDir}/${fileName}`))
})
