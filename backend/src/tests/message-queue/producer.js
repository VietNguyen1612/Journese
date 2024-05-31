const amqp = require("amqplib");

const messages = `Hello rabbitMQ`;

const runProducer = async () => {
  try {
    const connection = await amqp.connect(`amqp://guest:guest@localhost`);
    const channel = await connection.createChannel();

    const queueName = "test";
    await channel.assertQueue(queueName, {
      durable: true,
    });

    channel.sendToQueue(queueName, Buffer.from(messages));
  } catch (error) {
    console.log(error);
  }
};

runProducer().catch(console.err);
