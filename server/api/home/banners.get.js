import db from '@/server/db'
import fs, { link } from 'fs'


export default defineEventHandler(async(event) => {

  const records = await db.homeBanner.getAll()
  return records
})