import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
const runtimeConfig = useRuntimeConfig()
const prisma = new PrismaClient()

class Manager {

  async create(options) {
    const manager = await prisma.manager
      .create({
        data: {
          nickname: options.nickname,
          email: options.email,
          password: bcrypt.hashSync(options.password, 10),
        }
      })
      .catch((error) => {
        throw createError({
          statusCode: 500,
          statusMessage: `can't create new ${this.constructor.name}!`,
          info: error
        })
      })
    return manager
  }
  
  async updatePassword(id, password) {
    const updatedManager = await prisma.manager.update({
      where: { id: id },
      data: {
        password: bcrypt.hashSync(password, 10),
      }
    })
    return updatedManager
  }


  async findByEmail(options) {
    const userRecord = await prisma.manager
      .findFirst({
        where: {
          email: options.email
        }
      })
      .catch((error) => {
        throw createError({
          statusCode: 500,
          statusMessage: `Could not find ${this.constructor.name}! Please try again later.`
        })
      })

    return userRecord
  }

  async findInfoByEmail(options) {
    const userRecord = await this.findByEmail(options)
    return { 
      id: userRecord.id,
      nickname: userRecord.nickname,
      email: userRecord.email,
      loginToken: userRecord.loginToken,
    }
  }

  async findById(options) {
    const userRecord = await prisma.manager
      .findFirst({
        where: {
          id: options.id
        }
      })
      .catch((error) => {
        console.error(error)
        throw createError({
          statusCode: 500,
          statusMessage: `Could not find ${this.constructor.name}! Please try again later.`
        })
      })

    return userRecord
  }

  async verifyToken(id, token) {
    const managerData = await prisma.manager
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

    if (managerData) {
      return managerData.loginToken === token
    }

    return false
  }


  async verifyPassword(email, password) {
    const managerData = await this.findByEmail({ email });
    if (!managerData) {
      throw createError({
        statusCode: 400,
        statusMessage: 'email or password error!'
      })
    }
    
    // compare password
    if(!bcrypt.compareSync(password, managerData.password)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'email or password error!'
      })
    }

    return { managerData }
  }

  async login(email, password) {
    const { managerData } = await this.verifyPassword(email, password)
    console.log('u' , managerData);
    const maxAge = 60 * 60 * 24 * 7
    const expires = Math.floor(Date.now() / 1000) + maxAge
    const jwtToken = jwt.sign(
      {
        exp: expires,
        data: { id: managerData.id }
      },
      runtimeConfig.jwtSignSecretbackstage
    )

    // update token
    await prisma.manager.update({
      where: { id: managerData.id },
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
    const userInfo = await this.findInfoByEmail({ email });
    console.log(userInfo);
    return userInfo
  }


}



const manager = new Manager()
export default manager
