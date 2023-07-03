import db from '@/server/db'

export default defineEventHandler(async(event) => {

  if (!event.context.authBackstage) {
    return createError({
      statusCode: 401,
      message: 'You don\'t have the rights to access this resource',
    })
  }



  const options = await readBody(event)
  
  const record = await db.game.create()
  if (!record) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Could not find game.'
    })
  }


  return record
 
})