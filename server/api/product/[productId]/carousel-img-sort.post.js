import db from '@/server/db'
import fs from 'fs'
export default defineEventHandler(async(event) => {

  if (!event.context.authBackstage) {
    return createError({
      statusCode: 401,
      message: 'You don\'t have the rights to access this resource',
    })
  }

  const productId = parseInt(event.context.params.productId)
  const options = await readBody(event)
  const sortData = options.sortData
  
  const runtimeConfig = useRuntimeConfig()
  const publicDir = runtimeConfig.publicDir
  const carouselDir = `images/product/${productId}`
  const imagesDir = `${publicDir}/${carouselDir}`

  const ymd_date = Date.now().toString()

  // rename  filename
  for (let i = 0; i < sortData.length; i++) {  
    const fileName = sortData[i]
    const tmpFileName = `${ymd_date}-${i.toString().padStart(2, '0')}.jpg`
    try {
      await fs.promises.rename(`${imagesDir}/${fileName}`, `${imagesDir}/${tmpFileName}`)
    } catch (e) {
      createError({
        message: e.message,
        statusCode: 500,
        statusMessage: 'Unable to sort image: ${tmpFileName}. Error: ${e.message}'
      })
    }
  }

  const newImagesName = fs.readdirSync(`${imagesDir}`);

  if (newImagesName.length === 0) {
    return createError({
      message: 'No image found',
      statusCode: 500,
      statusMessage: 'No image found'
    })
  }

  
  const record = await db.product.updateImageUrl(productId, { imageUrl: `/api/public/${carouselDir}/${newImagesName[0]}` })

  if (!record) {
    return createError({
      message: 'updateImageUrl failed',
      statusCode: 500,
      statusMessage: 'updateImageUrl failed'
    })
  }



  return { 
    imagesName: newImagesName,
    succes: true 
  }
 
})