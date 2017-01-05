const amqp = require('amqplib');

const client = amqp.connect();

const open = client.then((c) => {
	return c.createChannel();
});

// The mail server, receives queues to send email and proceed
// to process them
open.then((ch) => {

	ch.assertExchange('email_sender', 'direct', { durable: true });

	ch.assertQueue('', { exclusive: true }).then((q) => {

		ch.bindQueue(q.queue, 'email_sender', '');
		ch.consume(q.queue, function (msg) {

			console.log('queue', msg.properties.replyTo);
			console.log(msg.content.toString());
			// console.log('carry out an action')
			ch.sendToQueue(msg.properties.replyTo, new Buffer(JSON.stringify({
				email: 'john.doe@mail.com',
				username: 'john doe',
				message: 'Thanks for signing up with APPNAME!',
			})), {
				correlationId: 'X0CBA7', 
				replyTo: q.queue
			});
		});

		//setTimeout(function() { ch.close(); process.exit(0) }, 500);
	});

	//ch.assertQueue('email', { durable: true });
	//ch.sendToQueue('email', new Buffer('hello world'));
});

