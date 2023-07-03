import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
const prisma = new PrismaClient()
class User {
  async getUserByProvider(options) {
    const userRecord = await prisma.user
      .findFirst({
        where: {
          providerName: options.providerName,
          providerUserId: options.providerUserId
        }
      })
      .catch((error) => {
        console.error(error)
        throw createError({
          statusCode: 500,
          statusMessage: 'Could not find user. Please try again later.'
        })
      })

    return userRecord
  }

  async createUser(options) {
    const userRecord = await prisma.user
      .create({
        data: {
          providerName: options.providerName,
          providerUserId: options.providerUserId,
          nickname: options.nickname,
          email: options.email.toLowerCase(),
          password: options.password,
          avatar: options.avatar,
          emailVerified: options.emailVerified
        }
      })
      .catch((error) => {
        console.error(error)
        throw createError({
          statusCode: 500,
          statusMessage: 'Could not create user. Please try again later.'
        })
      })

    return userRecord
  }
  

  async createUserByGoogle(options) {
    const userRecord = await prisma.user
      .create({
        data: {
          providerName: 'google',
          providerUserId: options.providerUserId,
          nickname: options.nickname,
          email: options.email.toLowerCase(),
          password: null,
          emailVerified: options.emailVerified
        }
      })
      .catch((error) => {
        console.error(error)
        throw createError({
          statusCode: 500,
          statusMessage: '無法建立使用者!'
        })
      })

    return userRecord
  }

  
  async createUserByEmail(options) {
    
    // 刪除未驗證的使用者
    await prisma.user
      .deleteMany({
        where: {
          email: options.email.toLowerCase(),
          emailVerified: false
        }
      })

    const userRecord = await prisma.user
      .create({
        data: {
          nickname: options.nickname,
          email: options.email.toLowerCase(),
          password: bcrypt.hashSync(options.password, 10),
        }
      })
      .catch((error) => {
        throw createError({
          statusCode: 400,
          statusMessage: "can't create new user!",
          info: error
        })
      })
    return userRecord
  }

  async getUserByEmail(email) {
    const userRecord = await prisma.user
      .findFirst({
        where: {
          email: email.toLowerCase()
        }
      })
      .catch((error) => {
        throw createError({
          statusCode: 500,
          statusMessage: 'Could not find user. Please try again later.'
        })
      })

    return userRecord
  }

  async getUserInfoByEmail(email) {
    const userRecord = await this.getUserByEmail(email)
    if (!userRecord) {
      throw createError({
        statusCode: 400,
        statusMessage: 'not found user data!'
      }) 
    }
    return { 
      id: userRecord.id,
      nickname: userRecord.nickname,
      email: userRecord.email.toLowerCase(),
    }
  }

  async getUserById(options) {
    const userRecord = await prisma.user
      .findFirst({
        where: {
          id: options.id
        }
      })
      .catch((error) => {
        console.error(error)
        throw createError({
          statusCode: 500,
          statusMessage: 'Could not find user. Please try again later.'
        })
      })

    return userRecord
  }

  async loginByGoogle(id, token) {
    const userRecord = await prisma.user
      .findFirst({
        where: { id: id }
      })
      .catch((error) => {
        console.error(error)
        throw createError({
          statusCode: 500,
          statusMessage: 'Could not find user. Please try again later.'
        })
      })

    // 更新紀錄
    if (userRecord) {
      await prisma.user.update({
        where: { id: id },
        data: {
          lastLoginAt: new Date(),
          loginToken: token
        },
      })
      .catch((error) => {
        console.error(error)
        throw createError({
          statusCode: 500,
          statusMessage: 'unknown error'
        })
      })
    }

    return userRecord
  }

  async updatePassword(id, password) {
    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: {
        password: bcrypt.hashSync(password, 10),
      }
    })
    return updatedUser
  }

  async updateEmailVerifyCode(id) {
    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: {
        emailVerifyCode: bcrypt.hashSync(Math.random().toString(), 1),
      }
    })
    return updatedUser
  }

  async verifyEmailCode(email, code) {
    const userRecord = await this.getUserByEmail(email.toLowerCase())
    if (userRecord.emailVerifyCode === code) {
      const updatedUser = await prisma.user.update({
        where: { id: userRecord.id },
        data: {
          emailVerified: true,
        }
      })
      return updatedUser
    } else {
      return null
    }
  }

  async verifyToken(id, token) {
    const userRecord = await prisma.user
      .findFirst({
        where: {
          id: id
        }
      })
      .catch((error) => {
        console.error(error)
        throw createError({
          statusCode: 500,
          statusMessage: 'Could not find user. Please try again later.'
        })
      })
    
    // 更新紀錄
    if (userRecord) {
      return userRecord.loginToken === token
    }

    return false
  }



  async isUserLogged(options) {
    const userRecord = await prisma.user
      .findFirst({
        where: {
          id: options.id
        }
      })
      .catch((error) => {
        console.error(error)
        throw createError({
          statusCode: 500,
          statusMessage: 'Could not find user. Please try again later.'
        })
      })

    return userRecord
  }

  async saveToken(id, jwtToken) {
    const userData = await this.getUserById({ id });

    // 更新紀錄
    if (userData) {
      await prisma.user.update({
        where: { id: id },
        data: {
          lastLoginAt: new Date(),
          loginToken: jwtToken
        },
      })
      .catch((error) => {
        console.error(error)
        throw createError({
          statusCode: 500,
          statusMessage: 'unknown error'
        })
      })
    }
    return userData
  }

  async verifyPasswordByEmail(email, password) {
    const userData = await this.getUserByEmail(email.toLowerCase());
    if (!userData) {
      throw createError({
        statusCode: 400,
        statusMessage: 'email or password error!'
      })
    }
    if(!bcrypt.compareSync(password, userData.password)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'password error!'
      })
    }
    return userData
  }

  async getOwnGames(userId) {
    const games = await prisma.userOwnGame.findMany({
      select: {
        id: true,
        game: {
          select : {
            id: true,
            name: true,
            headerImageUrl: true,
          }
        }
      },
      where: {
        userId: userId
      }
    })
    return games
  }

  async giveOwnGames(userId, gameId) {
    const games = await prisma.userOwnGame.create({
      data: {  
        user: { connect: { id: userId } },
        game: { connect: { id: gameId } }
      }
    })
    return games
  }
}




const user = new User()
export default user
