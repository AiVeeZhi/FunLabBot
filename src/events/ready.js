const { Events } = require('discord.js');
const mongoose = require('mongoose');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);

		mongoose.connect(process.env.MONGO_URI)
			.then(() => console.log('Connected to MongoDB'))
			.catch((error) => console.error('Failed to connect to MongoDB', error));

		const shutdown = async (signal, exitCode = 0) => {
			console.log(`\n${signal} signal received: closing connections...`);
			try {
				await mongoose.connection.close();
				console.log('MongoDB connection closed.');
				client.destroy();
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