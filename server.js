const amqp = require('amqplib');

const client = amqp.connect();

const open = client.then((c) => {
    return c.createChannel();
});

const express = require('express');
const app = express();
const PORT = require('./app/config/_main.js').port;

const emailClient = require('./app/middleware/email-factory.js');
app.set('view engine', 'ejs');

app.get('/invite', (req, res) => {
    const to = 'alexander.hongpin@gmail.com';
    emailClient.send({
        from: '"Fred Foo 👥" <foo@blurdybloop.com>',
        to: to,
        subject: 'Join us now!',
    }, {
        name: 'john',
        surname: 'doe',
        id: 'X07569'
    }).then((response) => {
        if (response) {
            res.status(200).json({
                data: 'successfull sent the email to ' + to
            });
        }
    });
});

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Go to /invite to send an email'
    });
});


open.then((ch) => {
//    app.get('/receive', (req, res) => {
        const q = 'task_queue';
        ch.assertQueue(q, { durable: true });
        ch.consume(q, (msg) => {
            console.log('[x] received: ', msg.content.toString());
            const message = JSON.parse(msg.content.toString());
            emailClient.send({
                from: message.from,
                to: message.to,
                subject: message.subject
            }, message.body).then((response) => {
                if (response) {
                    // res.status(200).json({
                    //     data: 'successfull sent the email to ' + message.to
                    // });
                    console.log('successfull sent the email to ' + message.to);
                    ch.ack(msg);
                }
            });
        }, { noAck: false });
//    });

    app.get('/send', (req, res) => {
        open.then((ch) => {
            const q = 'task_queue';
            ch.assertQueue(q, { durable: true });

            // The payload for the server
            const payload = JSON.stringify({
                from: '"Fred Foo 👥" <foo@blurdybloop.com>',
                to: 'alexander.hongpin@gmail.com',
                subject: 'join us now',
                body: {
                    name: 'john',
                    surname: 'doe',
                    id: 'X07569'
                }
            });
            ch.sendToQueue(q, new Buffer(payload), { persistent: true });

            console.log('[x] requesting email to be sent');

            //setTimeout(() => {
                //ch.close();
                res.status(200).json({
                    data: 'success'
                });
            //}, 500);
        });
    });

    startServer();
});


// var ch = channel;
// ch.assertExchange("my_intermediate_exchange", 'fanout', {durable: false});
// ch.assertExchange("my_final_delayed_exchange", 'fanout', {durable: false});

// // setup intermediate queue which will never be listened.
// // all messages are TTLed so when they are "dead", they come to another exchange
// ch.assertQueue("my_intermediate_queue", {
//       deadLetterExchange: "my_final_delayed_exchange",
//       messageTtl: 5000, // 5sec
// }, function (err, q) {
//       ch.bindQueue(q.queue, "my_intermediate_exchange", '');
// });

// ch.assertQueue("my_final_delayed_queue", {}, function (err, q) {
//       ch.bindQueue(q.queue, "my_final_delayed_exchange", '');

//       ch.consume(q.queue, function (msg) {
//           console.log("delayed - [x] %s", msg.content.toString());
//       }, {noAck: true});
// });


function startServer() {
    app.listen(PORT, () => {
        console.log(`listening to port *: ${ PORT }. press ctrl + c to cancel`);
    });
}

module.exports = app;