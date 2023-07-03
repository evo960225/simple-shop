import db from '@/server/db'
import fs from 'fs'
import TurndownService from 'turndown'

export default defineEventHandler(async(event) => {
  
  const id = parseInt(event.context.params.productId)

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

  const record = await db.product.find(id)
  const carouselImages = fs.readdirSync(`${imagesDir}`);
  record.carouselImages = carouselImages
  const turndownService = new TurndownService()


  // html to md
  try {
    const descriptionMarkdown = turndownService.turndown(record.descriptionHtml);
    record.descriptionMarkdown = descriptionMarkdown
  } catch {
    record.descriptionMarkdown = ''
  }

  if (!record) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Could not find product.'
    })
  }
  return record
})