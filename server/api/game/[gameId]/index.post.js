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
  const options = await readBody(event)
  
  const runtimeConfig = useRuntimeConfig()
  const publicDir = runtimeConfig.publicDir
  const carouselDir = `images/game/${gameId}/carousel/`
  const imagesDir = `${publicDir}/${carouselDir}`

  if (!Number.isInteger(gameId)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID should be an integer',
    })
  }


  // markdown convert to html
  const converter = new showdown.Converter()
  converter.setOption('simpleLineBreaks', true); // 換行轉換開啟
  converter.setOption('strikethrough', true); // 刪除線轉換開啟
  converter.setOption('tables', true); // 表格轉換開啟
  converter.setOption('tasklists', true); // 任務清單轉換開啟

  
  options.descriptionHtml = converter.makeHtml(options.descriptionMarkdown)

  const record = await db.game.upsert(gameId, options)

  
  const carouselImages = fs.readdirSync(`${imagesDir}`)
  record.carouselImages = carouselImages


  if (!record) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Could not find game.'
    })
  }
  return record
})