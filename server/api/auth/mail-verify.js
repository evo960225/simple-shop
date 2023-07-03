import db from '@/server/db'
export default defineEventHandler(async(event) => {
  const { email, authCode } = getQuery(event)
  const user = await db.user.getUserByEmail(email)  

  const updatedUser = await db.user.verifyEmailCode(email, authCode)

  const runtimeConfig = useRuntimeConfig()
  const host = runtimeConfig.public.host

  if (updatedUser) {
    // 301
    event.res.writeHead(301, {'Location' : `${host}/member/email-success`});
    event.res.end();
  } else {
    return { success: false }
  }
  
})