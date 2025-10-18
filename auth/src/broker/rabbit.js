import amqp from 'amqplib';
import config from '../config/config.js';

let channel, connection;

export async function connect() {
    try {
                connection = await amqp.connect(config.RABBITMQ_URI);
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