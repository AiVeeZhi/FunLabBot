import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { REST, Routes } from 'discord.js';
import { Command } from '../src/types/command';

const clientId = process.env.clientId ?? '';
const BOT_TOKEN = process.env.BOT_TOKEN ?? '';

const commands: unknown[] = [];
const foldersPath = path.join(__dirname, '../src/commands');
const commandFolders = fs.readdirSync(foldersPath);

const isScriptFile = (file: string) =>
	(file.endsWith('.js') || file.endsWith('.ts')) &&
	!file.endsWith('.d.ts') &&
	!file.endsWith('.map');

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	if (!fs.statSync(commandsPath).isDirectory()) continue;

	const commandFiles = fs.readdirSync(commandsPath).filter(isScriptFile);
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const imported = require(filePath);
		const command: Command = imported.default ?? imported;

		if (command && 'data' in command && 'execute' in command) {
			if (command.global === true) {
				commands.push(command.data.toJSON());
			} else {
				console.log(`[INFO] Skipping ${file} because 'global: true' is not set.`);
			}
		} else {
			console.log(
				`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
			);
		}
	}
}

const rest = new REST().setToken(BOT_TOKEN);

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data = (await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		)) as unknown[];

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();