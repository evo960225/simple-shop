import fs from 'fs'

export default defineEventHandler(async(event) => {
  
  const gameId = parseInt(event.context.params.gameId)

   if (!event.context.authBackstage && !event.context.auth) {
     return createError({
       statusCode: 401,
       message: 'You don\'t have the rights to access this resource',
     })
   }


  if (!Number.isInteger(gameId)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID should be an integer',
    })
  }

  if(event.context.auth) {
    // 檢查是否有購買遊戲
    const user = event.context?.auth?.user
    const game = await db.userOwnGame.findUnique({
      where: {
        userId: parseInt(user.id),
        gameId: gameId,
      },
    })
    if (!game) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      })
    }
  }


  const gameFilesData = getGameFilesDir(gameId)


  if (!gameFilesData) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Could not find game files.'
    })
  }
  return gameFilesData
})