import fs from 'node:fs'
export default defineEventHandler(async (event) => {
    const fileDir = event.context.params.slug
    const runtimeConfig = useRuntimeConfig()
    const publicDir = runtimeConfig.publicDir
    const filePath = `${publicDir}/images/${fileDir}`

    event.res.setHeader('Content-Type', 'image/jpeg')

    try {
      const files = fs.readFileSync(filePath);
      return files
    } catch (e) {
      return createError({
        statusCode: 404,
        message: 'File not found',
      })
    }
    

})
