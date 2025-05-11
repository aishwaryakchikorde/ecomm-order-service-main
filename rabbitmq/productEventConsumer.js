// rabbitmq/productEventConsumer.js
const amqp = require("amqplib");

const QUEUE_NAME = "product_events";
const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";

const consumeProductEvents = async () => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE_NAME, { durable: true });

    console.log(`Waiting for messages in queue: ${QUEUE_NAME}`);

    channel.consume(QUEUE_NAME, async (msg) => {
      if (msg !== null) {
        try {
          const event = JSON.parse(msg.content.toString());
          console.log("Received product event:", event);

          switch (event.type) {
            case "PRODUCT_UPDATED":
              // Optional: update internal cache or log
              console.log(`Product ${event.productId} updated with new stock: ${event.stock}`);
              break;
            case "PRODUCT_DELETED":
              console.warn(`Product ${event.productId} was deleted`);
              // Optional: Remove product from carts, notify users, etc.
              break;
            default:
              console.warn("Unknown event type:", event.type);
          }

          channel.ack(msg); // Mark message as processed
        } catch (err) {
          console.error("Error processing product event:", err);
          channel.nack(msg, false, false); // Reject and discard bad message
        }
      }
    });

  } catch (err) {
    console.error(" Failed to connect to RabbitMQ:", err);
  }
};

consumeProductEvents();
