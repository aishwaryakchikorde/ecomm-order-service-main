// sendTestMessage.js
const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err, connection) => {
  if (err) {
    console.error('Failed to connect to RabbitMQ:', err);
    return;
  }

  connection.createChannel((err, channel) => {
    if (err) {
      console.error('Failed to create channel:', err);
      return;
    }

    const queue = 'productEvents';
    const msg = JSON.stringify({
      type: 'PRODUCT_CREATED',
      payload: {
        productId: 'test123',
        name: 'Banana Charger',
        timestamp: new Date()
      }
    });

    channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
    console.log('Test message sent to productEvents queue');
    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  });
});
