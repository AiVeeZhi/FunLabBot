const { SlashCommandBuilder } = require('discord.js');
const { getRandomInt } = require('../../util/helpers.js');
const wednesdayJson = require('../../data/wednesday.json');
const wednesday = 'WEDNESDAY';

module.exports = {
	global: true,
	data: new SlashCommandBuilder().setName('day').setDescription('Return today\'s day'),
	async execute(interaction) {
		const dayOfWeekName = new Date().toLocaleString('en-US', { weekday: 'long' });
		console.log(`Day is ${dayOfWeekName}`);

		if (dayOfWeekName.toUpperCase() === wednesday) {
			let url = module.exports.getRandomWednesdayURL();
			// Fallback if url is empty
			if (!url) url = 'https://i.redd.it/gba4qos3ncoe1.jpeg';
			await interaction.reply(`It's ${wednesday} my dudes!\n${url}`);
		}
		else {
			await interaction.reply(`Today is ${dayOfWeekName}`);
		}
	},
	getRandomWednesdayURL() {
		const max = wednesdayJson.data.children.length - 1;
		const randomNumber = getRandomInt(0, max);
		console.log(randomNumber);
		const child = wednesdayJson.data.children[randomNumber].data;
		return child.url_overridden_by_dest || child.url;
	},
};