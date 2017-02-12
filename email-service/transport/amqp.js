
const service = require('../service.js')()

module.exports = function init ({ amqpConn }) {

  const exchange = 'email'
  // Bind consumer here
  amqpConn.createChannel().then((channel) => {

    const emailExchange = channel.assertExchange(exchange, 'topic', { durable: false })

    emailExchange.then((ex) => {
      const emailExchangeQueue = channel.assertQueue('', { exclusive: true })
      emailExchangeQueue.then((q) => {

        const keys = [
          'email.newsletter',
          'email.invite',
          'email.something'
        ]

        keys.forEach((key) => {
          channel.bindQueue(q.queue, ex.exchange, key)
        })

        channel.consume(q.queue, (message) => {
          let request = null
          const key = message.fields.routingKey
          const payload = JSON.parse(message.content.toString())
          switch (key) {
            case 'email.newsletter': 
              request = service.newsletter(payload)
              break
            case 'email.invite':
              break
            default:
              console.log('Unknown routing key:', routingKey)
          }
          request.then((data) => {
            // Store successful delivery to mongodb for analytics 
            // OR
            // Delete the delivery in mongodb
            console.log('[x] received at exchange', message.fields.routingKey, message.content.toString())
          })
          
        }, { noAck: true })
      })
    })
  })

}
