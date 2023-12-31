import fs from 'fs'
import multer from 'multer'
import { callNodeListener } from 'h3'


export default defineEventHandler(async (event) => {

  if (!event.context.authBackstage) {
    return createError({
      statusCode: 401,
      message: 'You don\'t have the rights to access this resource',
    })
  }


  const fileName = (await readBody(event)).fileName
  const productId = event.context.params.productId

  const runtimeConfig = useRuntimeConfig()
  const publicDir = runtimeConfig.publicDir
  const carouselDir = `images/product/${productId}`
  const imagesDir = `${publicDir}/${carouselDir}`

  try {
    fs.unlinkSync(`${imagesDir}/${fileName}`)
    fs.unlinkSync(`${imagesDir}/small/${fileName.split('.')[0]}-x500.jpg`)
  } catch (error) {
    return createError({
      message: error.message,
      statusCode: 500,
      statusMessage: 'detele error!'
    })
  }
  return {
    success: true
  }

});



