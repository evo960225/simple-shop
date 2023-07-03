import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import fs from 'fs'

class Order {

  async create(content) {
    // check user have game
    const games = content.games 
    const hasGames = await prisma.userOwnGame.findMany({
      where: { gameId: { in: games.map((x) => x.gameId) } },
    })

    if (hasGames.length > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'You have already bought this game.' 
      })
    }

    let orderRecord = null
    try {
      orderRecord = await prisma.$transaction(async (transaction) => {

        // check inventory
        const orderProducts = content.products 
        const products = await transaction.product.findMany({
          where: { id: { in: orderProducts.map((x) => x.productId) } },
          select: { id: true, quantity: true, },
        })

        for (const product of products) {
          product.orderQuantity = orderProducts.find((x) => x.productId === product.id).quantity
          if (product.quantity < product.orderQuantity) {
            throw createError({
              statusCode: 400,
              statusMessage: 'Insufficient inventory.' 
            })
          }
        }

        // create order
        const record = await transaction.order.create({
          include: {
            games: true,
            products: true
          },
          data: {
            games:{
              create: content.games.map((x) => {
                return {
                  gameId: x.gameId, 
                  price: x.price,
                }
              })
            },
            products:{
              create: content.products.map((x) => {
                return {
                  productId: x.productId, 
                  price: x.price,
                  quantity: x.quantity,
                }
              })
            },
            userId: content.userId,
            orderNumber: content.orderNumber,
            totalPrices: content.totalPrices,
            paymentTypeId: content.paymentTypeId,
            recipientName: content.recipientName,
            recipientPhoneNumber: content.recipientPhoneNumber,
            recipientEmail: content.recipientEmail,
            shippingMethodId: content.shippingMethodId,
            deliveryAddress: content.deliveryAddress,
            statusId: content.statusId,
            note: content.note,    
          }
        })
        
        // update inventory
        for (const product of products) {
          await transaction.product.update({
            where: {
              id: product.id
            },
            data: {
              quantity: {
                decrement: product.orderQuantity,
              },
            },
          });
        }
        return record
      })
    } catch (err) {
      if (err.statusCode !== 400) {
        console.log(err);
        throw createError({
          statusCode: 500,
          statusMessage: 'Could not create order.' 
        })
      } else {
        throw err
      } 
      
    } finally {
      await prisma.$disconnect()
    }

    return orderRecord
  }
   

  async update(content) {

    const updateContent = {
      recipientName: content.recipientName,
      recipientPhoneNumber: content.recipientPhoneNumber,
      deliveryAddress: content.deliveryAddress,
      statusId: content.statusId
    }

    const orderRecord = await prisma.order.update({
      where: {
        id: content.id
      },
      data: updateContent,
      include: {
        games: true,
        products: true
      },
    }).catch((error) => {
      throw createError({
        statusCode: 500,
        statusMessage: 'Could not find order or params error.'
      })
    })
    return orderRecord
  }

  async getPage(page=1, limit=10, sortType='desc') {
    const options = {
      skip: (page - 1) * limit,
      take: limit,
      include: {
        products: {
          include: {
            product: true,
          },
        },
        games: {
          include: {
            game: true,
          },
        },
        status: true,
        shippingMethod: true,
      }
    }
    if (sortType)  {
      options.orderBy = [ { orderNumber: sortType } ] 
    }
    const orderRecord = await prisma.order
      .findMany(options)
      .catch((error) => {
        throw createError({
          statusCode: 500,
          statusMessage: 'Could not find order. Please try again later.'
        })
      })
    const countRecord = await prisma.order.count()


    return {
      data: orderRecord,
      pageCount: Math.ceil(countRecord/limit),
      itemCount: countRecord,
    }
  }

  async getPageByUser(userId, page=1, limit=10, sortType='desc') {
    const options = {
      skip: (page - 1) * limit,
      take: limit,
      include: {
        products: {
          include: {
            product: true,
          },
        },
        games: {
          include: {
            game: true,
          },
        },
        status: true,
        shippingMethod: true,
      },
      where: { userId: userId }
    }

    if (sortType)  {
      options.orderBy = [ { orderNumber: sortType } ] 
    }

    const orderRecord = await prisma.order
      .findMany(options)
      .catch((error) => {
        throw createError({
          statusCode: 500,
          statusMessage: 'Could not find order. Please try again later.'
        })
      })
    const countRecord = await prisma.order.count({ where: { userId: userId } })

    return {
      data: orderRecord,
      pageCount: Math.ceil(countRecord/limit),
      itemCount: countRecord,
    }
  }

  async find(id) {
    const orderRecord = await prisma.order.findUnique({
      where: {
        id: id
      },
      include: {
        user: true,
        products: {
          include: {
            product: true,
          },
        },
        games: {
          include: {
            game: true,
          },
        },
        status: true
      },
    }).catch((error) => {
      throw createError({
        statusCode: 500,
        statusMessage: 'Could not find order. Please try again later.'
      })
    })
    return orderRecord
  }

  async delete(id) {
    const orderRecord = await prisma.order.delete({
      where: {
        id: id
      },
    }).catch((error) => {
      console.error(error);
      throw createError({
        statusCode: 500,
        statusMessage: 'Could not find order or params error.'
      })
    })

    if (!orderRecord) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Could not find order or params error.'
      })
    }

    return orderRecord
  }

  async getDeliveryFee(id) {
    const orderRecord = await prisma.shopOption.findUnique({
      where: {
        id: id
      },
    })

    if (!orderRecord) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Could not find order or params error.'
      })
    }

    return orderRecord
  }

  async updateTranStatus(orderNumber, status) {
    
    let statusId = 1
    if (status.TranStatus === 'S') {
      statusId = 2
    } else if (status.TranStatus === 'F') {
      statusId = 90
    }

    // 更新訂單狀態
    const updatedOrder = await prisma.order.update({
      where: {
        orderNumber: orderNumber
      },
      data: {
        status: { connect: { id: statusId } }
      }
    });

    if (!updatedOrder) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Could not find order or params error.'
      })
    }


    // 更新付款資訊
    const orderRecord = await prisma.order.update({
      where: {
        orderNumber: orderNumber
      },
      data: {
        payNowInfo: {
          create: {
            orderNo: orderNumber,
            BuysafeNo: status.BuysafeNo,
            TranStatus: status.TranStatus,
            PayType: status.PayType,
            ErrDesc: status.ErrDesc,
            pan_no4: status.pan_no4,
            installment: status.installment,
            BarCode1: status.BarCode1,
            BarCode2: status.BarCode2,
            BarCode3: status.BarCode3,
            BarCodeDueDate: status.DueDate,
          }
        }
      }
    })
    
   
    if (!orderRecord) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Could not find order or params error.'
      })
    }

    return orderRecord

  }

  async pendingShipmentCount() {
    // 狀態2: 待出貨
    // 依照商品統計待出貨數量
    const result = await prisma.orderProduct.groupBy({
      by: ['productId'],
      _count: {
        productId: true
      },
      where: {
        order: {
          statusId: 2
        }
      }
    });


    return result
  }

}


const order = new Order()
export default order
