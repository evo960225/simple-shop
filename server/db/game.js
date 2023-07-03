import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
const prisma = new PrismaClient()
import fs from 'fs'
import util from 'util';


class Game {
 
  async create() {
    const gameRecord = await prisma.game
      .create({
        data: {
        }
      })
      .catch((error) => {
        console.error(error)
        throw createError({
          statusCode: 500,
          statusMessage: 'Could not create game. Please try again later.'
        })
      })

    const makeDir = util.promisify(fs.mkdir)
    await makeDir(`./public/images/game/${gameRecord.id}`)
    await makeDir(`./public/images/game/${gameRecord.id}/carousel`)

    return gameRecord
  }

  

  async getAll(sort=false) {
    const options = {}
    if (sort)  {
      options.orderBy = [ { sortNumber: 'asc' } ] 
    }
    const gameRecord = await prisma.game
      .findMany(options)
      .catch((error) => {
        throw createError({
          statusCode: 500,
          statusMessage: 'Could not find game. Please try again later.'
        })
      })

    return gameRecord
  }

  async getShowAll(sort=false) {
    const options = {
      where: { isShow: true }
    }
    if (sort)  {
      options.orderBy = [ { sortNumber: 'asc' } ] 
    }
    const gameRecord = await prisma.game
      .findMany(options)
      .catch((error) => {
        throw createError({
          statusCode: 500,
          statusMessage: 'Could not find game. Please try again later.'  + error.statusMessage
        })
      })

    return gameRecord
  }


  async find(id) {
    const gameRecord = await prisma.game.findUnique({
      where: {
        id: id
      },
    }).catch((error) => {
      throw createError({
        statusCode: 500,
        statusMessage: 'Could not find game. Please try again later.'
      })
    })
    return gameRecord
  }

  async upsert(id, content) {

    const updateContent = {
      name: content.name,
      price: content.price,
      introduction: content.introduction,
      descriptionHtml: content.descriptionHtml,
      steamLink:content.steamLink,
      isShow: content.isShow,
    }


    const gameRecord = await prisma.game.upsert({
      where: {
        id: id
      },
      update: updateContent,
      create: updateContent,
    }).catch((error) => {
      console.error(error);
      throw createError({
        statusCode: 500,
        statusMessage: 'Could not find game or params error.'
      })
    })
    return gameRecord
  }

  async updateSortNumber(records) {
    records.asyncForEach(async(x) => {
      const updateRecord = {
        sortNumber: x.sortNumber,
      }
      await this.updateGameProperty(x.id, updateRecord, 'Could not find game or params error.');
    });
  
    return true;
  }
  
  async updateImageUrl(id, content) {
    const updateContent = {
      imageUrl: content.imageUrl,
    }
    return await this.updateGameProperty(id, updateContent, '無法更新遊戲圖片，請稍後再試。');
  }
  
  async updateHeaderImageUrl(id, content) {
    const updateContent = {
      headerImageUrl: content.headerImageUrl,
    }
    return await this.updateGameProperty(id, updateContent, '無法更新遊戲圖片，請稍後再試。');
  }
  
  async updateGameProperty(id, updateContent, statusMessage) {
    const gameRecord = await prisma.game.update({
      where: {
        id: id
      },
      data: updateContent,
    }).catch((error) => {
      throw createError({
        statusCode: 500,
        statusMessage: statusMessage
      });
    });
  
    return gameRecord;
  }

  async delete(id) {
    const gameRecord = await prisma.game.delete({
      where: {
        id: id
      },
    }).catch((error) => {
      console.error(error);
      throw createError({
        statusCode: 500,
        statusMessage: 'Could not find game or params error.'
      })
    })

    if (!gameRecord) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Could not find game or params error.'
      })
    }

    fs.rmSync(`./public/images/game/${id}`, { recursive: true, force: true })

    return gameRecord
  }

  async getSalesVolume() {
    const sales = await prisma.userOwnGame.groupBy({
      by: ['gameId'],
      _count: { 
       gameId: true 
      },

     
    }).catch((error) => {
      console.error(error);
      throw createError({
        statusCode: 500,
        statusMessage: 'Could not find game. Please try again later.'
      })
    })
    return sales
  }


}



const game = new Game()
export default game
