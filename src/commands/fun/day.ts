import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { getRandomInt } from '../../util/helpers';
import wednesdayJson from '../../data/wednesday.json';
import { Command } from '../../types/command';

const WEDNESDAY = 'WEDNESDAY';

function getRandomWednesdayURL(): string {
	const { children } = wednesdayJson.data;
	const max = children.length - 1;
	const randomNumber = getRandomInt(0, max);
	console.log(randomNumber);
	const child = children[randomNumber].data as {
		url_overridden_by_dest?: string;
		url?: string;
	};
	return child.url_overridden_by_dest || child.url || 'https://i.redd.it/gba4qos3ncoe1.jpeg';
}

const command: Command = {
	global: true,
	data: new SlashCommandBuilder().setName('day').setDescription("Return today's day"),
	async execute(interaction: ChatInputCommandInteraction): Promise<void> {
		const dayOfWeekName = new Date().toLocaleString('en-US', { weekday: 'long' });
		console.log(`Day is ${dayOfWeekName}`);

		if (dayOfWeekName.toUpperCase() === WEDNESDAY) {
			const url = getRandomWednesdayURL();
			await interaction.reply(`It's ${WEDNESDAY} my dudes!\n${url}`);
		} else {
			await interaction.reply(`Today is ${dayOfWeekName}`);
		}
	},
};

export default command;