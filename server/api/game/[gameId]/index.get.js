import db from '@/server/db'
import fs from 'fs'
import showdown from 'showdown'
import TurndownService from 'turndown';

export default defineEventHandler(async(event) => {
  
  const gameId = parseInt(event.context.params.gameId)

  if (!Number.isInteger(gameId)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID should be an integer',
    })
  }

  const record = await db.game.find(gameId)

  const runtimeConfig = useRuntimeConfig()
  const publicDir = runtimeConfig.publicDir
  const carouselDir = `images/game/${gameId}/carousel/`
  const imagesDir = `${publicDir}/${carouselDir}`

  const carouselImages = fs.readdirSync(`${imagesDir}`);
  const turndownService = new TurndownService();

  record.carouselImages = carouselImages

  // html to md
  try {
    const descriptionMarkdown = turndownService.turndown(record.descriptionHtml);
    record.descriptionMarkdown = descriptionMarkdown
  } catch {
    record.descriptionMarkdown = ''
  }
  
  if (!record) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Could not find game.'
    })
  }
  return record
})