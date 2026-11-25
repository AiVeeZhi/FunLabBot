import { Client, Events } from 'discord.js';
import mongoose from 'mongoose';
import { BotEvent } from '../types/event';

const event: BotEvent<Events.ClientReady> = {
	name: Events.ClientReady,
	once: true,
	execute(client: Client<true>): void {
		console.log(`Ready! Logged in as ${client.user.tag}`);

		const mongoUri = process.env.MONGO_URI ?? '';

		mongoose.connection.on('disconnected', () => {
			console.warn('MongoDB disconnected! Attempting to reconnect in 5 seconds...');
			setTimeout(() => {
				if (mongoose.connection.readyState === 0) {
					mongoose
						.connect(mongoUri)
						.catch((err) => console.error('Error while trying to reconnect to MongoDB:', err));
				}
			}, 5000);
		});

		mongoose.connection.on('error', (err) => {
			console.error('MongoDB connection error:', err);
		});

		mongoose
			.connect(mongoUri)
			.then(() => console.log('Connected to MongoDB'))
			.catch((error) => console.error('Failed to connect to MongoDB', error));

		const shutdown = async (signal: string, exitCode = 0): Promise<void> => {
			console.log(`\n${signal} signal received: closing connections...`);
			try {
				await mongoose.connection.close();
				console.log('MongoDB connection closed.');
				await client.destroy();
				console.log('Discord client destroyed.');
				process.exit(exitCode);
			} catch (error) {
				console.error('Error during shutdown:', error);
				process.exit(1);
			}
		};

		process.on('SIGINT', () => shutdown('SIGINT'));
		process.on('SIGTERM', () => shutdown('SIGTERM'));
		process.on('uncaughtException', (error) => {
			console.error('Uncaught Exception:', error);
			shutdown('uncaughtException', 1);
		});
		process.on('unhandledRejection', (reason) => {
			console.error('Unhandled Rejection:', reason);
			shutdown('unhandledRejection', 1);
		});
	},
};

export default event;