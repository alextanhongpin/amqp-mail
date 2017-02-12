// email-factory.js

const TemplateGenerator = require('../modules/template-generator.js')
const newsletter = TemplateGenerator('newsletter')

class EmailService {
  constructor ({ nodemailer }) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // Use SSL
      auth: {
        user: process.env.USER,
        pass: process.env.PASS
      }
    })
  }
  send (mailOptions) {
    return new Promise((resolve, reject) => {
      this.transporter.sendMail(mailOptions, (error, info) => {
        error ? reject(error) : resolve(info)
      })
    })
  }

  // Description: Send the newsletter to a list of recipients
  newsletter ({ from, to, subject, payload }) {
    return newsletter.render(payload)
    .then(({ html, text }) => {
      return this.send({
        from, to, subject, html, text
      })
    })
  }
  // Alias: Forgot Password
  resetPassword () {}
  verifyEmail () {}
  welcome () {}

}

module.exports = function init () {
  return new EmailService({
    nodemailer: require('nodemailer')
  })
}
