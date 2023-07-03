import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
const prisma = new PrismaClient()
import fs from 'fs'
const runtimeConfig = useRuntimeConfig()

class Product {
 
  async create() {
    const record = await prisma.product
      .create({
        data: {}
      })
      .catch((error) => {
        console.error(error)
        throw createError({
          statusCode: 500,
          statusMessage: 'Could not create user. Please try again later.'
        })
      })

    const publicDir = runtimeConfig.publicDir
    fs.mkdirSync(`${publicDir}/images/product/${record.id}`)
  
    return record
  }

  async update(content) {

    const updateContent = {
      gameId:  content.gameId,
      name: content.name,
      isHot: content.isHot,
      price: content.price,
      introduction: content.introduction,
      descriptionHtml: content.descriptionHtml,
      quantity: content.quantity,
      isShow: content.isShow,
    }

    const productRecord = await prisma.product.update({
      where: {
        id: content.id
      },
      data: updateContent,
    }).catch((error) => {
      console.error(error);
      throw createError({
        statusCode: 500,
        statusMessage: 'Could not find product or params error.'
      })
    })
    return productRecord
  }

  async updateProperty(id, updateContent, statusMessage) {
    const gameRecord = await prisma.product.update({
      where: {
        id: id
      },
      data: updateContent,
    }).catch((error) => {
      console.log(error);
      throw createError({
        statusCode: 500,
        statusMessage: statusMessage
      });
    });
  
    return gameRecord;
  }

  async updateImageUrl(id, content) {
    const updateContent = {
      imageUrl: content.imageUrl,
    }
    return await this.updateProperty(id, updateContent, 'Could not find product or params error.');
  }

  async getAll(includeGame = false) {
    const productRecord = await prisma.product
      .findMany({
        orderBy: { id: 'asc' },
        include: {
          game: includeGame, // Return all fields
        },
      })
      .catch((error) => {
        throw createError({
          statusCode: 500,
          statusMessage: 'Could not find product. Please try again later.'
        })
      })

    return productRecord
  }

  async getShowAll(includeGame = false) {
    const productRecord = await prisma.product
      .findMany({
        orderBy: { id: 'asc' },
        where: { isShow: true },
        include: {
          game: includeGame, // Return all fields
        },
      })
      .catch((error) => {
        throw createError({
          statusCode: 500,
          statusMessage: 'Could not find product. Please try again later.' + error.statusMessage
        })
      })

    return productRecord
  }

  async getHot(includeGame = false) {
    const productRecord = await prisma.product
      .findMany({
        orderBy: { id: 'asc' },
        where: { isHot: true },
        include: {
          game: includeGame, // Return all fields
        },
      })
      .catch((error) => {
        throw createError({
          statusCode: 500,
          statusMessage: 'Could not find product. Please try again later.'
        })
      })

    return productRecord
  }
  async find(id) {
    const productRecord = await prisma.product.findUnique({
      where: {
        id: id
      },
      include: {
        game: true, // Return all fields
      },
    }).catch((error) => {
      throw createError({
        statusCode: 500,
        statusMessage: 'Could not find product. Please try again later.'
      })
    })
    return productRecord
  }

  async delete(id) {
    const productRecord = await prisma.product.delete({
      where: {
        id: id
      },
    }).catch((error) => {
      console.error(error);
      throw createError({
        statusCode: 500,
        statusMessage: 'Could not find product or params error.'
      })
    })

    if (!productRecord) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Could not find product or params error.'
      })
    }

    fs.rmSync(`./public/images/product/${id}`, { recursive: true, force: true })

    return productRecord
  }

  async checkInventory(products) {
    const productRecord = await prisma.product.findMany({
      where: {
        id: {
          in: products.map(item => item.id)
        }
      }
    }).catch((error) => {
      throw createError({
        statusCode: 500,
        statusMessage: 'Could not find product. Please try again later.'
      })
    })

    const result = productRecord.map(storeItem => {
      const checkItem = products.find(item => item.id === storeItem.id)
      return {
        id: storeItem.id,
        name: storeItem.name,
        quantity: storeItem.quantity,
        checkQuantity: checkItem.count,
        isEnough: storeItem.quantity >= checkItem.count
      }
    })

    return result

  }

}


const product = new Product()
export default product
