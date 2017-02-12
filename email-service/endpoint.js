const SchemaNormalizer = require('../modules/schema-normalizer.js')
const fs = require('fs')
const path = require('path')
const ejs = require('ejs')

class Endpoint {
  constructor ({ service, amqpConn, schema }) {
    this.service = service
    this.amqpConn = amqpConn
    this.schema = schema
  }
  test (req, res) {
    // Flatten request
    SchemaNormalizer([
      this.schema.email(req.body),
      this.schema.template(req.body)
    ])
    .then((request) => this.service.send(request))
    .then((data) => {
      res.status(200).json({
        ok: true,
        data: data
      })
    }).catch((errors) => {
      res.status(400).json({
        error: {
          errors,
          code: 400,
          message: 'Bad Request'
        }
      })
    })
  }
  queue (req, res) {
    // Need nested if else to determine the type of request
    this.schema.key(req.body)
    .then((parsedRequest) => {
      let request = null
      switch (parsedRequest.key) {
        case 'email.newsletter':
          request = SchemaNormalizer([
            this.schema.key(req.body),
            this.schema.email(req.body),
            this.schema.newsletter({ payload: req.body })
          ])
          break
        default:
          return res.status(400).json({
            error: 'Bad request',
            description: 'Unhandled routing key ' + parsedRequest.key
          })
      }
      return request
    })
    .then((request) => {
      // Query to check if an email has been sent
      // Model.findOne({ email, from, to, deliveryStatus, event })

      // Store validated request to mongodb

      // AMQP supports buffer, which accepts only stringified strings
      // Stringify the request
      const message = JSON.stringify(request)
      const exchange = 'email'

      this.amqpConn.createChannel().then((channel) => {
        const emailExchange = channel.assertExchange(exchange, 'topic', { durable: false })

        emailExchange.then((ex) => {
          channel.publish(ex.exchange, request.key, new Buffer(message))

          res.status(200).json({
            success: true,
            message: '[x] Sent "Hello World"'
          })
        })
      })
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
        message: 'Invalid routing'
      })
    })
  }
  newsletter (req, res) {
    SchemaNormalizer([
      this.schema.email(req.body),
      this.schema.newsletter({ payload: req.body })
    ])
    .then((request) => this.service.newsletter(request))
    .then((data) => {
      res.status(200).json({
        ok: true,
        data: data
      })
    }).catch((error) => {
      res.status(400).json({
        error: error
      })
    })
  }
  // Display the target tempalte
  view (req, res) {
    const templateName = req.params.template
    const template = fs.readFileSync(path.join(__dirname, 'templates', templateName, 'html.ejs'), 'utf-8')
    res.end(ejs.render(template, {
      name: 'john',
      surname: 'john.doe',
      id: 1
    }))
  }
  healthCheck (req, res) {
    res.status(200).json({
      ok: true
    })
  }
}

module.exports = function init (props) {
  return new Endpoint(props)
}
