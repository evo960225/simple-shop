import fs from 'fs'
import db from '@/server/db'

export default defineEventHandler(async (event) => {

  if (!event.context.authBackstage) {
    return createError({
      statusCode: 401,
      message: 'You don\'t have the rights to access this resource',
    })
  }

  const id = (await readBody(event)).id

  const runtimeConfig = useRuntimeConfig()
  const publicDir = runtimeConfig.publicDir
  const homeBannerDir = `images/home-banner`
  const imagesDir = `${publicDir}/${homeBannerDir}`

  const record = await db.homeBanner.delete(id)
  const fileName = record.imageUrl.split('/').splice(-1)[0]

  try {
    fs.unlinkSync(`${imagesDir}/${fileName}`)
  } catch (error) {
    return createError({
      message: error.message,
      statusCode: 500,
      statusMessage: 'detele error!'
    })
  }
  return {
    success: true
  }

});



