const amqp = require('amqplib/callback_api');
const { publishOrderEvent } = require('../rabbitmq/ordereventPublisher');


exports.publishOrderEvent = (event) => {
  amqp.connect('amqp://localhost', (err, connection) => {
    if (err) {
      console.error('RabbitMQ connection error:', err);
      return;
    }

    connection.createChannel((err, channel) => {
      if (err) {
        console.error('RabbitMQ channel error:', err);
        return;
      }

      const queue = 'orderEvents';
      const msg = JSON.stringify(event);

      channel.assertQueue(queue, { durable: true });
      channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
      console.log('Order event published:', event);
    });
  });
 };

 // Place an order
router.post("/place", async (req, res) => {
    const { userId, items, totalAmount } = req.body;
  
    try {
      const order = new Order({ userId, items, totalAmount });
      await order.save();
  
      // PUBLISH ORDER PLACED EVENT HERE
      publishOrderEvent({
        type: 'ORDER_PLACED',
        payload: {
          orderId: order._id,
          userId: order.userId,
          totalAmount: order.totalAmount,
          timestamp: new Date()
        }
      });
  
      // Clear cart after placing order
      await Cart.deleteOne({ userId });
  
      res.status(201).json({ message: "Order placed!", order });
    } catch (err) {
      console.error("Order error:", err);
      res.status(500).json({ message: "Error placing order" });
    }
  });
  
