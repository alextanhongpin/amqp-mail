// email-factory.js
const EmailTemplate = require('email-templates').EmailTemplate
const path = require('path')
const templateDir = path.join(__dirname, 'templates', 'newsletter')
const newsletter = new EmailTemplate(templateDir)


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
        if (error) {
          reject(error)
        } else {
          resolve(info)
        }
      })
    })
  }

  newsletter ({ from, to, subject, payload }) {
    return newsletter.render({
      name: payload.name,
      surname: payload.surname,
      id: payload.id
    }).then(({ html, text }) => {
      return new Promise((resolve, reject) => {
        this.transporter.sendMail({
          from, to, subject, html, text
        }, (error, info) => {
          if (error) {
            reject(error)
          } else {
            resolve(info)
          }
        })
      })
    })
  }
}

module.exports = function init () {
  return new EmailService({
    nodemailer: require('nodemailer')
  })
}
