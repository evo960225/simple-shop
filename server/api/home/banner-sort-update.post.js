import db from '@/server/db'

export default defineEventHandler(async(event) => {

  if (!event.context.authBackstage) {
    return createError({
      statusCode: 401,
      message: 'You don\'t have the rights to access this resource',
    })
  }


  const options = await readBody(event)
  
  const isSuccess = await db.homeBanner.updateSortNumber(options.records)
  if (!isSuccess) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Could not find homeBanner.'
    })
  }
  return { succes: isSuccess }
 
})