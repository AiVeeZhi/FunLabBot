const { SlashCommandBuilder } = require('discord.js');
const wednesdayJson = require('../../data/wednesday.json');
const dayOfWeekName = new Date().toLocaleString('en-US', { weekday: 'long' });
const wednesday = 'WEDNESDAY';

module.exports = {
    global: true,
	data : new SlashCommandBuilder().setName('day').setDescription('Return today\'s day'),
	async execute(interaction) {
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
		const randomNumber = module.exports.getRandomInt(0, max);
		console.log(randomNumber);
		const child = wednesdayJson.data.children[randomNumber].data;
		return child.url_overridden_by_dest || child.url;
	},
	getRandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},
};