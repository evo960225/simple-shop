import db from '@/server/db'

export default defineEventHandler(async(event) => {

  const record = await db.orderStatus.getAll()
  return record

})