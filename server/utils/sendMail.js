import MailService from '@sendgrid/mail'
const runtimeConfig = useRuntimeConfig()
export default async function sendMail(email, subject, htmlContent) {

    const { host, serviceName } = runtimeConfig.public
    MailService.setApiKey(runtimeConfig.sendgridApiKey);

    console.log('sendMail', email, subject, htmlContent);
    const msg = {
      to: email,
      from: { name: serviceName, email: 'eternalalice@eternalalice.com' },
      subject: subject,
      text: serviceName,
      html:htmlContent
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
}

