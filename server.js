const express = require('express')
const amqp = require('./common/amqp.js')

const app = express()
const PORT = process.env.PORT

const EmailService = require('./email-service/transport.js')

const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

amqp.then((amqpConn) => {
  app.use('/api/v1/emails', EmailService({ amqpConn }))
  app.listen(PORT, () => {
      console.log(`listening to port *:${PORT}.\npress ctrl + c to cancel`)
  })
})
