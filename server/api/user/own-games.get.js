import db from '@/server/db'

export default defineEventHandler(async(event) => {

  const user = event.context?.auth?.user

  if (!user?.id) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }
  
  const games = await db.user.getOwnGames(user.id)

  if (!games) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Could not find games.'
    })
  }

  return games.map(game => {
    return {
      id: game.game.id,
      name: game.game.name,
      headerImageUrl: game.game.headerImageUrl,
    }
  })
  
})