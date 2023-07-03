import db from '@/server/db'
import fs from 'fs'
import path from 'path'
import multer from 'multer'
import { callNodeListener } from 'h3'


export default defineEventHandler(async (event) => {


  if (!event.context.authBackstage) {
    return createError({
      statusCode: 401,
      message: 'You don\'t have the rights to access this resource',
    })
  }

  const gameId = parseInt(event.context.params.gameId)

  const runtimeConfig = useRuntimeConfig()
  const publicDir = runtimeConfig.publicDir
  const headerDir = `images/game/${gameId}`
  const imagesDir = `${publicDir}/${headerDir}`
  const hashCode = generateHash()
  const filename = `header_tchinese`
  const fileFullName = `header_tchinese.${hashCode}.jpg`

  fs.readdir(imagesDir, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return;
    }
  
    files.forEach(file => {
      if (file.startsWith(filename)) {
        const filePath = path.join(imagesDir, file);
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error('Error deleting file:', err);
          } else {
            console.log('Deleted:', filePath);
          }
        });
      }
    });
  });


  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `${imagesDir}` )
    },
    filename: function (req, file, cb) {
      cb(null, fileFullName)
    }
  })

  const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      if (file.mimetype == "image/png" || file.mimetype == "image/jpeg") {
        cb(null, true)
      } else {
        cb(new Error('MIME格式不正確'))
      }
    }
  })
  try {
    await callNodeListener(upload.single('file'), event.req, event.res)
    await db.game.updateHeaderImageUrl(gameId, { headerImageUrl: `/api/public/${headerDir}/${fileFullName}` })
    return { 
      url: `/api/public/${headerDir}/${fileFullName}`,
      success: true 
    }
  } catch (e) {
    return createError({
      message: e.message,
      statusCode: 422,
      statusMessage: 'Unprocessable Entity'
    })
  }

})
