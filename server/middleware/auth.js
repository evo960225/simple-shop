import jwt from 'jsonwebtoken'
import db from '@/server/db'
const runtimeConfig = useRuntimeConfig()

export default defineEventHandler(async(event) => {

  const jwtToken = getCookie(event, 'access_token')
  if (!jwtToken) { return }

  try {
    const { data } = jwt.verify(jwtToken, runtimeConfig.jwtSignSecret)
   
    const userInfo = data
    if (userInfo?.id) {
      if (await db.user.verifyToken(userInfo?.id, jwtToken)) {
        event.context.auth = {
          user: {
            id: userInfo.id,
            loginToken: jwtToken
          }
        }
      }
    }
  } catch (e) {}
})