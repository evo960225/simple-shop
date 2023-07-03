import jwt from 'jsonwebtoken'
import db from '@/server/db'
const runtimeConfig = useRuntimeConfig()

export default defineEventHandler(async(event) => {

  const jwtToken = await getCookie(event, 'access_token_backstage')

  if (!jwtToken) { return }

  try {
    const { data } = jwt.verify(jwtToken, runtimeConfig.jwtSignSecretbackstage)
    const managerInfo = data
    if (managerInfo?.id) {
      if (await db.manager.verifyToken(managerInfo?.id, jwtToken)) {
        event.context.authBackstage = {
          manager: {
            id: managerInfo.id,
            loginToken: jwtToken
          }
        }
      }
    }
  } catch (e) {}
})