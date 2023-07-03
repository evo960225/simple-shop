import db from '@/server/db'
import fs from 'fs'
import multer from 'multer'
import { callNodeListener } from 'h3'


export default defineEventHandler(async(event) => {

  if (!event.context.authBackstage) {
    return createError({
      statusCode: 401,
      message: 'You don\'t have the rights to access this resource',
    })
  }
 
  const options = await readBody(event)
  const record = await db.homeBlock.update(options.id, options)
  return record

})
