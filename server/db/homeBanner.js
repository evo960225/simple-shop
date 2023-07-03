import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
const prisma = new PrismaClient()
import fs from 'fs'
import util from 'util';


class HomeBanner {
 
  async create(imageUrl, hyperLink=null) {
    const record = await prisma.homeBanner
      .create({
        data: {
          imageUrl: imageUrl,
          hyperLink: hyperLink
        }
      })
      .catch((error) => {
        console.error(error)
        throw createError({
          statusCode: 500,
          statusMessage: 'Could not create home-banner. Please try again later.'
        })
      })

    return record
  }

  

  async getAll(sort=false) {
    const options = sort ? {} : { orderBy: [ { sortNumber: 'asc' } ] }
    const record = await prisma.homeBanner
      .findMany(options)
      .catch((error) => {
        throw createError({
          statusCode: 500,
          statusMessage: 'Could not find home-banner. Please try again later.'
        })
      })

    return record
  }

  async find(id) {
    const record = await prisma.homeBanner.findUnique({
      where: {
        id: id
      },
    }).catch((error) => {
      throw createError({
        statusCode: 500,
        statusMessage: 'Could not find home-banner. Please try again later.'
      })
    })
    return record
  }

  async update(id, content) {

    const updateContent = {
      imageUrl: content.imageUrl,
      hyperLink: content.hyperLink,
      sortNumber: content.sortNumber,
      updatedAt: (new Date).toISOString()
    }


    const record = await prisma.homeBanner.update({
      where: {
        id: id
      },
      data: updateContent,
    }).catch((error) => {
      console.error(error);
      throw createError({
        statusCode: 500,
        statusMessage: 'Could not find home-banner or params error.'
      })
    })
    return record
  }


  async delete(id) {
    const record = await prisma.homeBanner.delete({
      where: {
        id: id
      },
    }).catch((error) => {
      console.error(error);
      throw createError({
        statusCode: 500,
        statusMessage: 'Could not find home-banner or params error.'
      })
    })

    if (!record) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Could not find home-banner or params error.'
      })
    }

    return record
  }

  async updateSortNumber(records) {
    console.log(records);
    records.asyncForEach(async(x) => {
      const updateRecord = {
        sortNumber: x.sortNumber,
        updatedAt: (new Date).toISOString()
      }
      const gameRecord = await prisma.homeBanner.update({
        where: { id: x.id },
        data: updateRecord,
      }).catch((error) => {
        console.error(error);
        throw createError({
          statusCode: 500,
          statusMessage: 'Could not find banner or params error.',
        })
      })
    });
  
    return true
  }
}




const homeBanner = new HomeBanner()
export default homeBanner
