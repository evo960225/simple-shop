import fs from 'fs'
import multer from 'multer'
import { callNodeListener } from 'h3'


export default defineEventHandler(async (event) => {

  const fileName = (await readBody(event)).fileName
  const gameId = event.context.params.gameId

  const runtimeConfig = useRuntimeConfig()
  const publicDir = runtimeConfig.publicDir
  const gamelDir = `${publicDir}/games/${gameId}/public`

  try {
    fs.unlinkSync(`${gamelDir}/${fileName}`)
  } catch (error) {
    return createError({
      message: error.message,
      statusCode: 500,
      statusMessage: 'detele error!'
    })
  }

  const gameFilesData = getGamePublicFilesDir(gameId)
  return gameFilesData

});



