import db from '@/server/db'

export default defineEventHandler(async(event) => {

  const record = await db.product.getShowAll()
  
  if (!record) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Could not find product.'
    })
  }

  return record
})