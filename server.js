const express = require('express')
const bodyParser = require('body-parser')
const helmet = require('helmet')

const amqp = require('./common/amqp.js')
const compression = require('compression')

const app = express()
const PORT = process.env.PORT

const EmailService = require('./email-service/transport.js')


app.use(helmet())
app.use(compression())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

amqp.then((amqpConn) => {
  // Setup HTTP transport
  app.use('/api/v1/emails', EmailService.http({ amqpConn }))
  // Setup AMQP transport
  EmailService.amqp({ amqpConn })
  app.listen(PORT, () => {
      console.log(`listening to port *:${PORT}.\npress ctrl + c to cancel`)
  })
})
