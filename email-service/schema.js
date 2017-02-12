const SchemaValidator = require('../modules/schema-validator.js')

let mailOptions = {
    from: '"Fred Foo 👻" <foo@blurdybloop.com>', // sender address
    to: 'bar@blurdybloop.com, baz@blurdybloop.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world ?', // plain text body
    html: '<b>Hello world ?</b>' // html body
}

// Compile a list of schemas to be validated
const validator = SchemaValidator([
  require('./schema/defs.json'),
  require('./schema/email.json'),
  require('./schema/key.json'),
  require('./schema/newsletter.json'),
  require('./schema/template.json')
])

// Register the schema
module.exports = {
  email: validator.register('http://localhost:3000/schemas/email.json#'),
  template: validator.register('http://localhost:3000/schemas/template.json#'),
  key: validator.register('http://localhost:3000/schemas/key.json#'),
  newsletter: validator.register('http://localhost:3000/schemas/newsletter.json#'),
}

// Usage:
// schema.sendEmailRequest(params)
// .then((validatedParams) => {
//  
// }).catch((error) => {
// 404 Bad Request
// })

