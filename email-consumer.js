
const amqp = require('amqplib');

const open = amqp.connect().then((c) => {
	return c.createChannel();
});


open.then((ch) => {
	const q = 'task_queue';
	ch.assertQueue(q, { durable: true });
	ch.consume(q, (msg) => {


		console.log('[x] received: ', msg.content.toString());
		setTimeout(() => {
			ch.ack(msg);
			//ch.close();
			//process.exit(0);
		}, 500);
	}, { noAck: false });


	
});