import db from '@/server/db'
import { PrismaClient } from '@prisma/client'
import fs from 'node:fs'
import multer from 'multer'
import bcrypt from 'bcryptjs'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  
  if (!event.context.authBackstage) {
    return createError({
      statusCode: 401,
      message: 'You don\'t have the rights to access this resource',
    })
  }

  const gameId = parseInt(event.context.params.gameId)
  const { chunkIndex } = event.req.headers;

  // 如果資料夾不存在，建立資料夾
  const runtimeConfig = useRuntimeConfig()
  const publicDir = runtimeConfig.publicDir
  const gameDir = `${publicDir}/games/${gameId}/`
  if (!fs.existsSync(gameDir)) {
    fs.mkdirSync(gameDir, { recursive: true })
  }

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `${gameDir}` )
    },
    filename: function (req, file, cb) {
      cb(null, Buffer.from(file.originalname, 'latin1').toString(
        'utf8',
      ))
    }
  })

  let fileType= ''
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 500 * 1024 * 1024, // 例如，將限制設置為 500MB
    },
    fileFilter: (req, file, cb) => {
      cb(null, true)
    }
  })

  await callNodeListener(upload.any('gameFile'), event.req, event.res)
  
  const gameFilesData = getGameFilesDir(gameId)
  return gameFilesData

})
