import db from '@/server/db'
import fs from 'fs'
import bcrypt from 'bcryptjs'
import multer from 'multer'
import { callNodeListener } from 'h3'


export default defineEventHandler(async(event) => {

  if (!event.context.authBackstage) {
    return createError({
      statusCode: 401,
      message: 'You don\'t have the rights to access this resource',
    })
  }

  const runtimeConfig = useRuntimeConfig()
  const publicDir = runtimeConfig.publicDir
  const homeBannerUrl = `/images/home-banner`
  const imagesDir = `${publicDir}${homeBannerUrl}`

  const images = fs.readdirSync(imagesDir).filter((file) => {
    const stats = fs.statSync(`${imagesDir}/${file}`)
    return stats.isFile() && /\.(jpe?g|png)$/.test(file)
  })

  let largestFileNumber = 0;
  images.forEach(function(fileName) {
    const fileNumber = parseInt(fileName.split('.')[0])
    if (fileNumber > largestFileNumber) {
      largestFileNumber = fileNumber;
    }
  });

  const newFileNumber = largestFileNumber + 1
  const hashCode = generateHash()
  const fileName = `${newFileNumber.toString().padStart(2, '0')}.${hashCode}.jpg` 

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, imagesDir)
    },
    filename: function (req, file, cb) {
      cb(null, fileName)
    }
  })

  const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      if (file.mimetype == "image/png" || file.mimetype == "image/jpeg") {
        cb(null, true)
      } else {
        cb(new Error('文件格式不支持'))
      }
    }
  })


  try {
    await callNodeListener(upload.single('image'), event.req, event.res)
  } catch (e) {
    console.error(e);
    return createError({
      message: '圖片上傳失敗',
      statusCode: 422,
      statusMessage: 'Unprocessable Entity'
    })
  }

  const record = await db.homeBanner.create(`/api/public${homeBannerUrl}/${fileName}`)

  return record

})
