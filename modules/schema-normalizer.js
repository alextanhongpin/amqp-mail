// normalize-schema.js

// Normalize the schema to a flat structure

module.exports = function init (schemas) {
  return Promise.all(schemas)
  .then((data) => {
    return data.reduce((a, b) => {
      return Object.assign({}, a, b)
    }, {})
  })
}