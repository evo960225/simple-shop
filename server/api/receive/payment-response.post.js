import crypto from 'crypto'
import db from '@/server/db'
import sendMail from '../../utils/sendMail';

export default defineEventHandler(async (event) => {
  const { paynowId, paynowPassword } = useRuntimeConfig()
  const { host } = useRuntimeConfig().public
  const data = await formToJson(event.req)

  // api確認密碼( WebNo + OrderNo + Total Price + 商家交易密碼 + Status)
  const generPassCode = (crypto
    .createHash("sha1")
    .update(`${paynowId}${data.OrderNo}${data.TotalPrice}${paynowPassword}${data.TranStatus}`)
    .digest("hex")
  )

  if (data.PassCode.toLowerCase() !== generPassCode) {
    return createError({
      statusCode: 400,
      message: 'passCode error',
    })
  }

  const record = await db.order.updateTranStatus(data.OrderNo, data) 
  const updatedOrder = await db.order.find(record.id)
  for (const x of updatedOrder.games) {
    await db.user.giveOwnGames(updatedOrder.userId, x.gameId)
  }
  
  if (data.TranStatus === 'S') {
    const user = await db.user.getUserById({id: updatedOrder.userId})
    const email = user.email
    sendMail(user.email, '訂單付款成功',`
      <p>親愛的 ${user.nickname} 您好</p>
      <p>您的訂單已經付款成功，訂單編號為 <span>${updatedOrder.orderNumber}</span>，請至會員中心查看
      <a href="${host}/member/order-management">訂單詳情</a>
      </p>
      <p>感謝您的支持！</p>
      <br>
      <p>${serviceName}</p>
    `)
    event.res.writeHead(301, {'Location' : `${host}/checkout/creditcard-success`});
    event.res.end();
  } else if (data.TranStatus === 'F') {
    event.res.writeHead(301, {'Location' : `${host}/checkout/creditcard-failed`});
    event.res.end();
  }

  event.res.writeHead(301, {'Location' : `${host}`});
  event.res.end(); 
                                                                                                                          
});