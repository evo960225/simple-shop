import db from '@/server/db'
import fs from 'fs'
import showdown from 'showdown'


export default defineEventHandler(async(event) => {
  
  if (!event.context.authBackstage) {
    return createError({
      statusCode: 401,
      message: 'You don\'t have the rights to access this resource',
    })
  }

  const gameId = parseInt(event.context.params.gameId)
  const runtimeConfig = useRuntimeConfig()
  const publicDir = runtimeConfig.publicDir
  const gameFilesDir = `/games/${gameId}/public`
  const gameFilesAllDir = `${publicDir}${gameFilesDir}`

  // is not eixst game dir
  if (!fs.existsSync(gameFilesAllDir)) {
    fs.mkdirSync(gameFilesAllDir)
  }
  

  // make bat file
  const batFile = `
    @echo off
    set remoteHost=eternalalice.koreacentral.cloudapp.azure.com
    set remoteUser=EternalAlice
    set remotePath=${process.cwd()}/${gameFilesAllDir}
    set localFile=%1
    
    
    scp %localFile% %remoteUser%@%remoteHost%:%remotePath%
    
    echo.
    echo Upload completed. Press any key to continue...
    pause > nul
  `

  // return and download bat file
  event.res.setHeader('Content-Type', 'application/octet-stream')
  event.res.setHeader('Content-Disposition', `attachment; filename=${gameId}.bat`)
  return batFile

})