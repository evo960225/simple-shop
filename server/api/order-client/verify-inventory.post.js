import db from '@/server/db'

export default defineEventHandler(async(event) => {

  if (!event.context.auth) {
    return createError({
      statusCode: 401,
      message: 'You don\'t have the rights to access this resource',
    })
  } 

  const { products } = await readBody(event)
  const cartCheckedRecord = await db.product.checkInventory(products)
  if (!cartCheckedRecord) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Could not find product.'
    })
  }
  return cartCheckedRecord

})