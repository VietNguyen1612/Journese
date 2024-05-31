// const amqp = require("amqplib");

// const runConsumer = async () => {
//   try {
//     const connection = await amqp.connect(`amqp://guest:guest@localhost`);
//     const channel = await connection.createChannel();

//     const queueName = "test";
//     await channel.assertQueue(queueName, {
//       durable: true,
//     });

//     channel.consume(
//       queueName,
//       (msg) => console.log(msg.content.toString()),
//       {}
//     );
//   } catch (error) {
//     console.log(error);
//   }
// };

// runConsumer().catch(console.err);
