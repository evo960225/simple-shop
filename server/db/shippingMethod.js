import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()



class ShippingMethod {
 
  async getAll() {
    const record = await prisma.ShippingMethod
      .findMany()
      .catch((error) => {
        throw createError({
          statusCode: 500,
          statusMessage: 'Could not find ShippingMethod. Please try again later.'
        })
      })

    return record
  }

  async updatePrice(id, deliveryFee) {
    const record = await prisma.ShippingMethod
      .update({
        where: {
          id: id
        },
        data: {
          deliveryFee: deliveryFee,
        }
      })
      .catch((error) => {
        throw createError({
          statusCode: 500,
          statusMessage: 'Could not find ShippingMethod. Please try again later.'
        })
      })

    return record
  }

}


const shippingMethod = new ShippingMethod()
export default shippingMethod
