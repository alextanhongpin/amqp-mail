# Email Microservice

*Work in Progress*

Creating a queue:

```
const newsletterQueue = channel.assertQueue(queue, { durable: false })

newsletterQueue.then((q) => {
  channel.consume(q.queue, (message) => {
    console.log('[x] Received message from newsletter queue', message.content.toString())
  }, { noAck: true })
})

const inviteQueue = channel.assertQueue('invite', { durable: false })

inviteQueue.then((q) => {
  channel.consume(q.queue, (message) => {
    console.log('[x] Received message from invite queue', message.content.toString())
  }, { noAck: true })
})

```