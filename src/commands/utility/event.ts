import {
	ButtonInteraction,
	ChatInputCommandInteraction,
	InteractionContextType,
	MessageFlags,
	SlashCommandBuilder,
	StringSelectMenuInteraction,
} from 'discord.js';
import { buildEventModal } from '../../components/events/eventModal';
import { getServerEvents } from '../../util/serverMethods';
import { buildEventListComponents } from '../../components/events/eventListSelectMenu';
import { Command } from '../../types/command';

const actions = {
	CREATE: 'create',
	EDIT: 'edit',
	CANCEL: 'cancel',
} as const;

type ActionType = (typeof actions)[keyof typeof actions];

const data = new SlashCommandBuilder()
	.setName('event')
	.setDescription('Create, Modify, Delete Discord Events')
	.setContexts(InteractionContextType.Guild)
	.addSubcommand((subcommand) =>
		subcommand.setName('create').setDescription('Create a Discord event'),
	)
	.addSubcommand((subcommand) =>
		subcommand.setName('edit').setDescription('Modify an existing Discord event'),
	)
	.addSubcommand((subcommand) =>
		subcommand.setName('cancel').setDescription('Remove a Discord Event'),
	);

async function startEventActionFlow(
	interaction: ChatInputCommandInteraction,
	action: ActionType,
): Promise<void> {
	const events = await getServerEvents(interaction);
	if (!events || events.size === 0) {
		await interaction.reply({
			content: 'There are no upcoming events',
			flags: MessageFlags.Ephemeral,
		});
		return;
	}

	const content = action === actions.EDIT ? 'Select an event to modify' : 'Select an event to cancel';

	const response = await interaction.reply({
		content,
		components: buildEventListComponents(events, action),
		flags: MessageFlags.Ephemeral,
		withResponse: true,
	});

	let selectedEventId: string | null = null;
	const message = response.resource?.message;
	if (!message) return;

	const collector = message.createMessageComponentCollector({
		filter: (i) => i.user.id === interaction.user.id,
		time: 60000,
	});

	collector.on('collect', async (i) => {
		if (i.isStringSelectMenu() && i.customId === 'eventScheduleSelect') {
			selectedEventId = (i as StringSelectMenuInteraction).values[0];
			await i.deferUpdate();
		} else if (
			i.isButton() &&
			(i.customId === 'editEventButton' || i.customId === 'cancelEventButton')
		) {
			if (!selectedEventId) {
				await i.reply({
					content: 'Please select an event first',
					flags: MessageFlags.Ephemeral,
				});
				return;
			}

			if (i.customId === 'editEventButton') {
				console.log(`Selected Event ID: ${selectedEventId}`);
				const modal = await buildEventModal(actions.EDIT, i, selectedEventId);
				await (i as ButtonInteraction).showModal(modal);
				await interaction.deleteReply();
				collector.stop();
			} else if (i.customId === 'cancelEventButton') {
				const guild = interaction.client.guilds.cache.get(interaction.guildId ?? '');
				if (guild) {
					try {
						const event = await guild.scheduledEvents.fetch(selectedEventId);
						await event.delete();
						await (i as ButtonInteraction).update({
							content: `Event **${event.name}** was successfully cancelled!`,
							components: [],
						});
						collector.stop('deleted');
					} catch (error) {
						console.error('Error cancelling event', error);
						await i.reply({
							content: 'There was an error cancelling the event.',
							flags: MessageFlags.Ephemeral,
						});
					}
				}
			}
		} else if (i.isButton() && i.customId === 'cancelButton') {
			await i.deferUpdate();
			collector.stop('cancelled');
		}
	});

	collector.on('end', async (_collected, reason) => {
		if (reason === 'cancelled') {
			await interaction.editReply({
				content: 'Event selection cancelled',
				components: [],
			});
		} else if (reason === 'time') {
			await interaction.editReply({
				content: 'Event selection timed out',
				components: [],
			});
		}
	});
}

const command: Command = {
	global: true,
	data,
	async execute(interaction: ChatInputCommandInteraction): Promise<void> {
		const subcommand = interaction.options.getSubcommand() as ActionType;
		switch (subcommand) {
			case actions.CREATE: {
				const modal = await buildEventModal(actions.CREATE, interaction);
				await interaction.showModal(modal);
				break;
			}
			case actions.EDIT: {
				await startEventActionFlow(interaction, actions.EDIT);
				break;
			}
			case actions.CANCEL: {
				await startEventActionFlow(interaction, actions.CANCEL);
				break;
			}
		}
	},
};

export default command;