import db from '@/server/db'

export default defineEventHandler(async(event) => {

  if (!event.context.authBackstage) {
    return createError({
      statusCode: 401,
      message: 'You don\'t have the rights to access this resource',
    })
  }

  const record = await db.game.getAll(true)
  if (!record) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Could not find game.'
    })
  }
  return record
 
})