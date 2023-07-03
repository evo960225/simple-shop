import db from '@/server/db'
import fs from 'fs'
import showdown from 'showdown'


export default defineEventHandler(async(event) => {
  
  if (!event.context.authBackstage) {
    return createError({
      statusCode: 401,
      message: 'You don\'t have the rights to access this resource',
    })
  }

  const id = parseInt(event.context.params.productId)
  const options = await readBody(event)
  
  if (!Number.isInteger(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID should be an integer',
    })
  }


  const runtimeConfig = useRuntimeConfig()
  const publicDir = runtimeConfig.publicDir
  const productDir = `images/product/${id}`
  const imagesDir = `${publicDir}/${productDir}`


  // markdown convert to html
  const converter = new showdown.Converter()
  converter.setOption('simpleLineBreaks', true); // 換行轉換開啟
  options.descriptionHtml = converter.makeHtml(options.descriptionMarkdown)

  const record = await db.product.update(options)

  
  const carouselImages = fs.readdirSync(`${imagesDir}`)
  record.carouselImages = carouselImages


  if (!record) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Could not find product.'
    })
  }
  return record
})