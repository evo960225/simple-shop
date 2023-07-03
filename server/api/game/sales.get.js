import db from '@/server/db'

export default defineEventHandler(async(event) => {

  if (!event.context.authBackstage) {
    return createError({
      statusCode: 401,
      message: 'You don\'t have the rights to access this resource',
    })
  }

  const sales = await db.game.getSalesVolume()
  if (!sales) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Could not find game.'
    })
  }

  const games = await db.game.getAll()

  if (!games) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Could not find game.'
    })
  }

  const returnSales = sales.map((sale) => {
    const game = games.find((game) => game.id === sale.gameId)
    return {
      ...sale,
      gameName: game.name,
    }
  })

  return returnSales
 
})    