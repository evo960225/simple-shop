import db from '@/server/db'
import { PrismaClient } from '@prisma/client'
import fs from 'node:fs'
import multer from 'multer'

export default defineEventHandler(async (event) => {

  // if (!event.context.authBackstage) {
  //   return createError({
  //     statusCode: 401,
  //     message: 'You don\'t have the rights to access this resource',
  //   })
  // }

  const { cssContent } = await readBody(event)

  // 如果資料夾不存在，建立資料夾
  const runtimeConfig = useRuntimeConfig()
  const publicDir = runtimeConfig.publicDir
  const cssDir = `${publicDir}/styles/`
  if (!fs.existsSync(cssDir)) {
    fs.mkdirSync(cssDir, { recursive: true })
  }

  fs.writeFileSync(`${cssDir}/description.css`, cssContent);

  return {
    url: '/api/styles/description.css',
    cssContent: cssContent
  }
})
