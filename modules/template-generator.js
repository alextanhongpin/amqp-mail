const path = require('path')
const EmailTemplate = require('email-templates').EmailTemplate

module.exports = function init (type) {
  const templateDir = path.join(__dirname, '..', 'email-service', 'templates', type)
  return new EmailTemplate(templateDir)
}