const SchemaValidator = require('../modules/schema-validator.js')

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
  newsletter: validator.register('http://localhost:3000/schemas/newsletter.json#')
}
