import db from '@/server/db'

export default defineEventHandler(async(event) => {

  if (!event.context.authBackstage) {
    return createError({
      statusCode: 401,
      message: 'You don\'t have the rights to access this resource',
    })
  } 

  const orderId = parseInt(event.context.params.orderId)
  const options = await readBody(event)

  
  const updatedOrder = await db.order.update(options)
  if (!updatedOrder) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Could not find product.'
    })
  }

  // 已付款、出貨、完成的訂單，要把遊戲加入使用者的遊戲庫
  if (options.statusId === 2 || options.statusId === 3 || options.statusId === 4) {

    const userOwnGame = (await db.user.getOwnGames(updatedOrder.userId)).map((x) => x.game.id)
    for (const orderGame of updatedOrder.games) {
      if (!userOwnGame.includes(orderGame.gameId)) {
        await db.user.giveOwnGames(updatedOrder.userId, orderGame.gameId)
      }
    }
  }
  return updatedOrder
})