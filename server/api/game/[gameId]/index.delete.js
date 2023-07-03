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


  const id = parseInt(event.context.params.gameId)
  const options = await readBody(event)
  
  if (!Number.isInteger(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID should be an integer',
    })
  }


  const record = await db.game.delete(id)

  if (!record) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Could not find game.'
    })
  }
  return record
})