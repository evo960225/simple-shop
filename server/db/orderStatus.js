import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
const prisma = new PrismaClient()
import fs from 'fs'
import util from 'util';


class OrderStatus {
 

  async getAll() {
    const record = await prisma.orderStatus
      .findMany({ orderBy: { id: 'asc' } })
      .catch((error) => {
        throw createError({
          statusCode: 500,
          statusMessage: 'Could not find home-banner. Please try again later.'
        })
      })

    return record
  }

}


const orderStatus = new OrderStatus()
export default orderStatus
