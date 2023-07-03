import fs from 'fs'
import multer from 'multer'
import { callNodeListener } from 'h3'


export default defineEventHandler(async (event) => {

  if (!event.context.authBackstage) {
    return createError({
      statusCode: 401,
      message: 'You don\'t have the rights to access this resource',
    })
  }

  const fileName = (await readBody(event)).fileName
  const gameId = event.context.params.gameId

  const runtimeConfig = useRuntimeConfig()
  const publicDir = runtimeConfig.publicDir
  const carouselDir = `images/game/${gameId}/carousel/`
  const imagesDir = `${publicDir}/${carouselDir}`

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



