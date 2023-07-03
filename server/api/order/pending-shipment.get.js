import db from '@/server/db'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async(event) => {

  if (!event.context.authBackstage) {
    return createError({
      statusCode: 401,
      message: 'You don\'t have the rights to access this resource',
    })
  } 
  const { page, pageSize } = getQuery(event)
  const parsedPage = parseInt(page) || 1
  const parsedLimit = parseInt(pageSize) || 10
  const skip = (parsedPage - 1) * parsedLimit;

  const products = await prisma.product.findMany({
    skip: skip,
    take: parsedLimit,
    include: {
      game: { select: { name: true } },
    },
  });

  const productCountsWithDetails = await Promise.all(
    products.map(async (product) => {
      const orderProducts = await prisma.orderProduct.findMany({
        where: {
          productId: product.id,
          order: {
            statusId: 2, // 待出貨狀態
          },
        },
        orderBy: { id: 'asc' },
      });

      const count = orderProducts.reduce((total, orderProduct) => total + orderProduct.quantity, 0);
      product.pendingShipmentCount = count
      return product
    })
  );


  return {
    data: productCountsWithDetails,
    total: await prisma.product.count(),
  }

})