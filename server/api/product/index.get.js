import db from '@/server/db'

export default defineEventHandler(async(event) => {

  if (!event.context.authBackstage) {
    return createError({
      statusCode: 401,
      message: 'You don\'t have the rights to access this resource',
    })
  } 
  
  const record = await db.product.getAll()

  // // change small image name
  // record.forEach((item) => {
  //   item.carouselImagesSmall = item.carouselImages.map((file) => {
  //     const ext = path.extname(file);
  //     const fileName = file.split('.')[0]
  //     return `${fileName}-x500${ext}`
  //   })
  // })

  if (!record) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Could not find product.'
    })
  }

  return record
})