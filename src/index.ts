import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { Command } from './types/command';
import { BotEvent } from './types/event';

const { BOT_TOKEN } = process.env;

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildScheduledEvents],
});

client.commands = new Collection();
client.cooldowns = new Collection();

const isScriptFile = (file: string) =>
	(file.endsWith('.js') || file.endsWith('.ts')) &&
	!file.endsWith('.d.ts') &&
	!file.endsWith('.map');

// Load Commands
const folderPath = path.join(__dirname, 'commands');
if (fs.existsSync(folderPath)) {
	const commandFolders = fs.readdirSync(folderPath);

	for (const folder of commandFolders) {
		const commandsPath = path.join(folderPath, folder);
		if (!fs.statSync(commandsPath).isDirectory()) continue;

		const commandFiles = fs.readdirSync(commandsPath).filter(isScriptFile);
		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);
			const imported = require(filePath);
			const command: Command = imported.default ?? imported;

			if (command && 'data' in command && 'execute' in command) {
				client.commands.set(command.data.name, command);
			} else {
				console.log(
					`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
				);
			}
		}
	}
}

// Load Events
const eventsPath = path.join(__dirname, 'events');
if (fs.existsSync(eventsPath)) {
	const eventFiles = fs.readdirSync(eventsPath).filter(isScriptFile);

	for (const file of eventFiles) {
		const filePath = path.join(eventsPath, file);
		const imported = require(filePath);
		const event: BotEvent = imported.default ?? imported;

		if (event && event.name && event.execute) {
			if (event.once) {
				client.once(event.name, (...args: unknown[]) =>
					(event.execute as (...a: unknown[]) => void)(...args),
				);
			} else {
				client.on(event.name, (...args: unknown[]) =>
					(event.execute as (...a: unknown[]) => void)(...args),
				);
			}
		}
	}
}

client.login(BOT_TOKEN);