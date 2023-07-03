import db from '@/server/db'

export default defineEventHandler(async(event) => {

  const manager = event.context?.authBackstage?.manager
  
  if (!manager?.id) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  const managerData = await db.manager.findById({
    id: manager.id
  })

  if (!managerData) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Could not find manager.'
    })
  }

  return {
    id: managerData.id,
    nickname: managerData.nickname,
    email: managerData.email,
    loginToken: managerData.loginToken
  }

})