
import MailService from '@sendgrid/mail'
import bcrypt from 'bcryptjs'
import db from '@/server/db'
const runtimeConfig = useRuntimeConfig()


export default defineEventHandler(async(event) => {

  if (!event.context.auth) {
    return createError({
      statusCode: 401,
      message: 'You don\'t have the rights to access this resource',
    })
  } 
  
  const userRecord = await db.user.updateEmailVerifyCode(event.context.auth.user.id)
  if (!userRecord) {
    return createError({
      statusCode: 400,
      message: 'Could not find user.',
    })
  }
  const { host, serviceName } = runtimeConfig.public
  MailService.setApiKey(runtimeConfig.sendgridApiKey);
  const authCode = userRecord.emailVerifyCode
  const email = userRecord.email
  const userName = userRecord.nickname
  


  const msg = {
    to: email,
    from: { name: `${serviceName}`, email: 'eternalalice@eternalalice.com' },
    subject: `信箱驗證-${serviceName}`,
    text: '驗證信箱碼',
    html: `
    <!DOCTYPE html>
      <html>
      <head>
        <title>信箱驗證-${serviceName}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            font-size: 16px;
            line-height: 1.5;
            padding: 20px;
            background-color: #f5f5f5;
          }
          
          h1 {
            font-size: 24px;
            margin-bottom: 20px;
          }
          
          p {
            margin-bottom: 20px;
          }
          
          a {
            display: inline-block;
            padding: 10px 20px;
            background-color: #0077cc;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 4px;
            transition: background-color 0.2s ease-in-out;
          }
          
          a:hover {
            background-color: #005299;
          }

        </style>
      </head>
      <body>
        <h1>您好${userName}，歡迎加入${runtimeConfig}！</h1>
        <p>請點選下面連結來驗證您的信箱：</p>
        <a href="${host}/api/auth/mail-verify?email=${email}&authCode=${authCode}">點擊驗證</a>
        <p>如果您没有註冊此服務，或者不想進行驗證，請忽略此郵件。</p>
      </body>
      </html>
      `,
  };
  await MailService
    .send(msg)
    .then((response) => {
      console.log(response[0].statusCode)
      console.log(response[0].headers)
    })
    .catch((error) => {
      return createError({
        statusCode: 400,
        message: 'email address isn\'t exist.',
      })
    })
  return { success: true };
})