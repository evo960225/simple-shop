import fs from 'node:fs'
export default defineEventHandler(async (event) => {
    const fileDir = event.context.params.slug
    const runtimeConfig = useRuntimeConfig()
    const publicDir = runtimeConfig.publicDir
    const filePath = `${publicDir}/styles/description.css`

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
