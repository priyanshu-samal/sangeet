import amqp from 'amqplib';
import config from '../config/config.js';

let channel, connection;

export async function connect() {
    try {
                connection = await amqp.connect(config.rabbitMQURI);
        channel = await connection.createChannel();
        console.log('Connected to RabbitMQ');
    } catch (error) {
        console.error('Failed to connect to RabbitMQ', error);
        throw error;
    }
}

export async function publishToQueue(queueName, message) {
    await channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(queueName, Buffer.from(message));
}  

export async function subscribeToQueue(queueName, callback) {
    await channel.assertQueue(queueName, { durable: true });
    channel.consume(queueName, async(msg) => {
       await  callback(JSON.parse(msg.content.toString()));
        await channel.ack(msg);
    });

    
}