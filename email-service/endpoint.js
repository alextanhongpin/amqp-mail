const mailOptions = {
    from: '"Fred Foo 👻" <foo@blurdybloop.com>', // sender address
    to: 'alextan220990@gmail.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world ?', // plain text body
    html: '<b>Hello world ?</b>' // html body
}

class Endpoint {
  constructor({ service, amqpConn }) {
    this.service = service
    this.amqpConn = amqpConn
  }
  test (req, res) {
    this.service.send(mailOptions)
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
  producer (req, res) {
    console.log('GET /producer')
    const key = req.query.key || 'email.newsletter'
    const validKeys = new Set(['email.invite', 'email.newsletter'])
    const message = JSON.stringify({
      from: '"Fred Foo 👻" <foo@blurdybloop.com>', // sender address
      to: 'alextan220990@gmail.com', // list of receivers
      subject: 'Hello ✔', // Subject line
      payload: {
        name: 'John Doe',
        surname: 'john.doe',
        id: 1
      }
    })
    if (!validKeys.has(key)) {
      return res.status(400).json({
        error: 'Invalid key, unable to process email'
      })
    } else {
      const exchange = 'email'

      this.amqpConn.createChannel().then((channel) => { 
        const emailExchange = channel.assertExchange(exchange, 'topic', { durable: false })

        emailExchange.then((ex) => {
          channel.publish(ex.exchange, key, new Buffer(message))

          res.status(200).json({
            success: true,
            message: '[x] Sent "Hello World"'
          })
        })
      })
    }
  }
  newsletter (req, res) {
    this.service.newsletter({
      from: '"Fred Foo 👻" <foo@blurdybloop.com>', // sender address
      to: 'alextan220990@gmail.com', // list of receivers
      subject: 'Hello ✔', // Subject line
      payload: {
        name: 'John Doe',
        surname: 'john.doe',
        id: 1
      }
    })
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
}

module.exports = function init (props) {
  return new Endpoint(props)
}