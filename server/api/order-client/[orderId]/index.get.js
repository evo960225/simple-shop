import db from '@/server/db'

export default defineEventHandler(async(event) => {

  if (!event.context.authBackstage) {
    return createError({
      statusCode: 401,
      message: 'You don\'t have the rights to access this resource',
    })
  } 
  const { page, limit } = getQuery(event)
  const parsedPage = parseInt(page)
  const parsedLimit = parseInt(limit)

  const record = await db.order.getPage(parsedPage, parsedLimit)
  if (!record) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Could not find product.'
    })
  }

  return record
})