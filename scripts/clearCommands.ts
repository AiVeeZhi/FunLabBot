import 'dotenv/config';
import { REST, Routes } from 'discord.js';

const clientId = process.env.clientId ?? '';
const guildId = process.env.guildId ?? '';
const BOT_TOKEN = process.env.BOT_TOKEN ?? '';

const rest = new REST().setToken(BOT_TOKEN);

(async () => {
	try {
		console.log('Started clearing application (/) commands.');

		await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] });

		console.log('Successfully deleted all application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();