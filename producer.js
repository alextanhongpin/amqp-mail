const express = require('express');
const app = express();

const amqp = require('amqplib');

const client = amqp.connect();

const open = client.then((c) => {
	return c.createChannel();
});

// Check the namespace pattern
open.then((ch) => {

	// What you publish to
	ch.assertExchange('email_sender', 'direct', { durable: true });



	ch.assertQueue('', { exclusive: true }).then((q) => {

		// Bind the queue to the exchange
		//ch.bindQueue(q.queue, 'email_sender', '');
		const shortid = 'X0CBA7';

		ch.prefetch(1);
		ch.consume(q.queue, function(msg) {
			console.log('msg.properties, collection id', msg.content, msg.properties);
			if (msg.properties.correlationId === shortid) {
				console.log('Got %s', msg.content.toString());
				setTimeout(function() {
					ch.close();
					process.exit(0);
				}, 500);
			}
			
		}, { noAck: true });

		// you can bind multiple routing key, not necessarily one only
		// # bindQueue(queue, source, routing key, [args])

		ch.publish('email_sender', '', new Buffer(JSON.stringify({
			email: 'john.doe@mail.com',
			username: 'john doe',
			message: 'Thanks for signing up with APPNAME!',
		})), {
			correlationId: shortid, 
			replyTo: q.queue
		});

	});
});