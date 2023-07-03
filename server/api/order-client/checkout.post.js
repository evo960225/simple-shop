import db from '@/server/db'
import moment from 'moment'
import crypto from 'crypto'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
const runtimeConfig = useRuntimeConfig()

export default defineEventHandler(async(event) => {

  if (!event.context.auth) {
    return createError({
      statusCode: 401,
      message: 'You don\'t have the rights to access this resource',
    })
  } 

  const content = await readBody(event)

  moment.locale('zh-tw')
  content.orderNumber = moment().format('YYYYMMDDHHmmss')
  const record = await db.order.create(content)
  
  // check price
  // games
  const games = await prisma.game.findMany({
    where: {
      id: {
        in: content.games.map(game => game.gameId)
      }
    }
  })
  
  const gamesPrices = games.reduce((total, game) => {
    return total + game.price
  }, 0);
  
  // products
  const products = await prisma.product.findMany({
    where: {
      id: {
        in: content.products.map(product => product.productId)
      }
    }
  })

  const productsPrices = products.reduce((total, product) => {
    return total + product.price * content.products.find(x => x.productId === product.id).quantity
  }, 0);

  //  shipping fee
  const shippingFee = (await prisma.shippingMethod.findUnique({
    where: {
      id: content.shippingMethodId
    }
  })).deliveryFee

  // 沒有實體商品就免運
  const shippingPrice = products?.length > 0 ? shippingFee : 0

  // 確認金額是否相符
  if (gamesPrices + productsPrices + shippingPrice !== record.totalPrices) {
    createError({
      statusCode: 400,
      statusMessage: 'Price error.'
    })
  }
  
  const backendPrice = parseInt(gamesPrices) + parseInt(productsPrices) + parseInt(shippingPrice)
  console.log('gerh', backendPrice, record.totalPrices);

  const { paynowId, paynowPassword } = runtimeConfig

  // api串接要求加密( WebNo + OrderNo + Total Price + 商家交易密碼)
  record.passCode = crypto.createHash("sha1").update(`${paynowId}${record.orderNumber}${backendPrice}${paynowPassword}`).digest("hex")
  return record
  
})