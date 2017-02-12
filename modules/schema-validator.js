const Ajv = require('ajv')

module.exports = function Validator (schemas) {
  const ajv = Ajv({
    allErrors: true,
    removeAdditional: true,
    schemas: schemas
  })

  function register (schema) {
    return function (params) {
      // Don't modify the original params directly
      // Always create a copy
      const copy = Object.assign({}, params)
      return new Promise ((resolve, reject) => {
        const validator = ajv.getSchema(schema)
        const valid = validator(copy)
        valid ? resolve(copy) : reject(validator.errors)
      })
    }
  }
  return { register }
}
