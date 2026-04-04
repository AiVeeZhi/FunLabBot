const { Events, MessageFlags, Collection, GuildScheduledEventEntityType, GuildScheduledEventPrivacyLevel } = require('discord.js');
const { isValidDateTimeInput, parseCSTDate } = require('../util/timeUtils.js');
const { getServerEventById } = require('../util/serverMethods.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (interaction.isChatInputCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			const { cooldowns } = interaction.client;

			if (!cooldowns) {
				// Fallback in case client.cooldowns is missing in index.js
				interaction.client.cooldowns = new Collection();
			}

			if (!interaction.client.cooldowns.has(command.data.name)) {
				interaction.client.cooldowns.set(command.data.name, new Collection());
			}

			const now = Date.now();
			const timestamps = interaction.client.cooldowns.get(command.data.name);
			const defaultCooldownDuration = 3;
			const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1_000;

			if (timestamps.has(interaction.user.id)) {
				const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

				if (now < expirationTime) {
					const expiredTimestamp = Math.round(expirationTime / 1000);
					return interaction.reply({
						content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`,
						flags: MessageFlags.Ephemeral,
					});
				}
			}

			timestamps.set(interaction.user.id, now);
			setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(error);
				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({
						content: 'There was an error while executing this command!',
						flags: MessageFlags.Ephemeral,
					});
				} else {
					await interaction.reply({
						content: 'There was an error while executing this command!',
						flags: MessageFlags.Ephemeral,
					});
				}
			}
		} else if (interaction.isModalSubmit()) {
			if (interaction.customId.startsWith('editEventModal') || interaction.customId === 'createEventModal') {
				const name = interaction.fields.getTextInputValue('eventName');
				const location = interaction.fields.getTextInputValue('eventLocation');
				const startDateString = interaction.fields.getTextInputValue('eventStartDate').replace(/\s+/g, '');
				const endDateString = interaction.fields.getTextInputValue('eventEndDate').replace(/\s+/g, '');
				const description = interaction.fields.getTextInputValue('eventDescription');

				if (!isValidDateTimeInput(startDateString) || !isValidDateTimeInput(endDateString)) {
					console.log(`Start Time format: ${startDateString} :` + isValidDateTimeInput(startDateString));
					console.log(`End Time format: ${endDateString} :` + isValidDateTimeInput(endDateString));
					return interaction.reply({
						content: 'Invalid date time format! Use `MM/DD HH:MMam/pm` or `MM/DD/YYYY HH:MMam/pm` (e.g. `5/2 3:30pm` or `11/23/2026 11am`). Assumes CST.',
						flags: MessageFlags.Ephemeral
					})
				}

				// Interpret the user input explicitly as CST/CDT
				const startTime = parseCSTDate(startDateString);
				console.log(`Start Time: ${startTime}`);
				const endTime = parseCSTDate(endDateString);
				console.log(`End Time: ${endTime}`);


				if (interaction.customId === 'createEventModal') {
					try {
						const event = await interaction.guild.scheduledEvents.create({
							name: name,
							scheduledStartTime: startTime,
							scheduledEndTime: endTime,
							privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
							entityType: GuildScheduledEventEntityType.External,
							entityMetadata: { location: location },
							description: description,
						});
						await interaction.reply({
							content: `Event **${event.name}** create Sucessfully`,
							flags: MessageFlags.Ephemeral
						})
					} catch (error) {
						console.error(error);
						await interaction.reply({
							content: 'Error creating event.',
							flags: MessageFlags.Ephemeral
						});
					}
				} else if (interaction.customId.startsWith('editEventModal')) {
					try {
						const eventId = interaction.customId.split('_')[1];
						const event = await getServerEventById(interaction, eventId);
						await event.edit({
							name: name,
							scheduledStartTime: startTime,
							scheduledEndTime: endTime,
							privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
							entityType: GuildScheduledEventEntityType.External,
							entityMetadata: { location: location },
							description: description,
						});
						await interaction.reply({
							content: `Event **${event.name}** updated Sucessfully`,
							flags: MessageFlags.Ephemeral
						});
					} catch (error) {
						console.error(error);
						await interaction.reply({
							content: 'Error updating event.',
							flags: MessageFlags.Ephemeral
						});
					}
				}
			}
		}
	},
};