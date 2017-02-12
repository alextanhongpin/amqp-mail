

const router = require('express').Router()
const service = require('../service.js')()
const Endpoint = require('../endpoint.js')
const schema = require('../schema.js')

module.exports = function init ({ amqpConn }) {

  const endpoint = Endpoint({
    service,
    amqpConn,
    schema
  })

  router.get('/health_check', endpoint.healthCheck.bind(this))

  router.post('/test', endpoint.test.bind(endpoint))
  router.post('/queue', endpoint.queue.bind(endpoint))
  router.get('/view/:template', endpoint.view.bind(endpoint))
  router.post('/newsletter', endpoint.newsletter.bind(endpoint))

  return router
}

