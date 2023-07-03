import fs from 'fs'

export default defineEventHandler(async(event) => {
  
  const gameId = parseInt(event.context.params.gameId)


  if (!Number.isInteger(gameId)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID should be an integer',
    })
  }


  const gameFilesData = getGamePublicFilesDir(gameId)

  if (!gameFilesData) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Could not find game files.'
    })
  }
  return gameFilesData
})