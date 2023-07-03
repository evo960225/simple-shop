import fs from 'fs'
import multer from 'multer'
import jimp from 'jimp'
import { callNodeListener } from 'h3'
import db from '@/server/db'


export default defineEventHandler(async(event) => {

  if (!event.context.authBackstage) {
    return createError({
      statusCode: 401,
      message: 'You don\'t have the rights to access this resource',
    })
  }

  const productId = parseInt(event.context.params.productId)
  const runtimeConfig = useRuntimeConfig()

  const publicDir = runtimeConfig.publicDir
  const carouselDir = `images/product/${productId}`
  const imagesDir = `${publicDir}/${carouselDir}`
  const carouselImages = fs.readdirSync(imagesDir)

  let largestFileName = '';
  carouselImages.forEach(function(ele) {
    if(largestFileName < ele) {
      largestFileName = ele;
    }
  });

  const ymd_date = Date.now().toString()
  const fileNumber = largestFileName ? parseInt(largestFileName.split('.')[0]) + 1 : 0
  const fileName = `${ymd_date}-${fileNumber.toString().padStart(2, '0')}`
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `${imagesDir}` )
    },
    filename: function (req, file, cb) {
      cb(null, `${fileName}.jpg`)
    }
  })

  let fileType = ''
  const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      fileType = file
      if (file.mimetype == "image/png" || file.mimetype == "image/jpeg") {
        cb(null, true)
      } else {
        cb(new Error('MIME格式不正確'))
      }
    }
  })
  try {
    await callNodeListener(upload.single('carouselImage'), event.req, event.res)
    if (fileType === "image/png") {
      const image = await jimp.read(`${imagesDir}/${fileName}.png`)
      await image.writeAsync(`${imagesDir}/${fileName}.jpg`);
    }
    
  } catch (e) {
    return createError({
      message: e.message,
      statusCode: 422,
      statusMessage: 'Unprocessable Entity'
    })
  }

  if (fileNumber === 0) {
    const record = await db.product.updateImageUrl(productId, { imageUrl: `/api/public/${carouselDir}/${fileName}.jpg` })
  }
  
  return { 
    url: `${fileName}.jpg`,
    success: true 
  }
})
