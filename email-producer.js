
const amqp = require('amqplib');

const open = amqp.connect().then((c) => {
	return c.createChannel();
});


open.then((ch) => {
	const q = 'task_queue';
	ch.assertQueue(q, { durable: true });
	ch.sendToQueue(q, new Buffer('hello world'), { persistent: true });

	console.log('[x] requesting email to be sent');

	setTimeout(() => {
		ch.close();
		process.exit(0);
	}, 500);
});