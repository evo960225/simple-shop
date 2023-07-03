import db from '@/server/db'

export default defineEventHandler(async(event) => {

  const record = await db.game.getShowAll(true)
  if (!record) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Could not find game.'
    })
  }
  return record
 
})