
const router = require('express').Router()
const service = require('./service.js')()
const Endpoint = require('./endpoint.js')


module.exports = function init ({ amqpConn }) {

  const endpoint = Endpoint({
    service,
    amqpConn
  })
  router.get('/', (req, res) => {
    res.status(200).json({
      ok: true
    })
  })
  router.get('/test', endpoint.test.bind(endpoint))
  router.get('/producer', endpoint.producer.bind(endpoint))
  router.get('/newsletter', endpoint.newsletter.bind(endpoint))

  const queue = 'newsletter'
  const exchange = 'email'
  // Bind consumer here
  amqpConn.createChannel().then((channel) => {


    const emailExchange = channel.assertExchange(exchange, 'topic', { durable: false })

    emailExchange.then((ex) => {
      console.log('at email exchange', ex)
      const emailExchangeQueue = channel.assertQueue('', { exclusive: true })
      emailExchangeQueue.then((q) => {
        console.log('At email exchange queue', q)

        const keys = [
          'email.newsletter',
          'email.invite',
          'email.something'
        ]

        keys.forEach((key) => {
          console.log('key', key)
          channel.bindQueue(q.queue, ex.exchange, key)
        })

        channel.consume(q.queue, (message) => {

          const key = message.fields.routingKey
          const payload = JSON.parse(message.content.toString())
          switch (key) {
            case 'email.newsletter': 
              // Handle newsletter
              service.newsletter(payload)
              break
            case 'email.invite':
              // Handle invite
            default:
              console.log('Unknown routing key:', routingKey)
          }
          console.log('[x] received at exchange', message.fields.routingKey, message.content.toString())
        }, { noAck: true })
      })
    })
  })

  return router
}

