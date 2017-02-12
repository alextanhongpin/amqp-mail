# Email Microservice

__Work in Progress__

TODO: 
1. Work on documentation
2. Add working example
3. Add db to track delivery/avoid duplication
4. Add practices for message queue (rabbitmq)
5. Add dashboard for template customization (backlog)


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

## Helpers

Helpers are placed in the modules folder, since they can be reused in other applications. Once their use case has been defined, they can be published at npm.

Helpers are named with endings '-or' or '-er'
e.g. EmailGenerator, TemplateMaker, SchemaValidator


### Schema Normalizer

Sometimes you need to work with the flattened results of the schema

- avoid duplication of schema declaration
- avoid nested schema (validate directly against req.query or req.body)
- flattened request

### Template Generator

Makes the ease of creating
