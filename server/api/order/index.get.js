import db from '@/server/db'

export default defineEventHandler(async(event) => {

  if (!event.context.authBackstage) {
    return createError({
      statusCode: 401,
      message: 'You don\'t have the rights to access this resource',
    })
  } 
  const { page, limit } = getQuery(event)
  const parsedPage = parseInt(page) || 1
  const parsedLimit = parseInt(limit) || 10
  console.log(parsedPage);

  const record = await db.order.getPage(parsedPage, parsedLimit)
  if (!record) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Could not find product.'
    })
  }

  return record
})