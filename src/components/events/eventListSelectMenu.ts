import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	Collection,
	GuildScheduledEvent,
	Snowflake,
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
} from 'discord.js';

export function buildEventList(
	events: Collection<Snowflake, GuildScheduledEvent>,
): ActionRowBuilder<StringSelectMenuBuilder> {
	const eventSelect = new StringSelectMenuBuilder()
		.setCustomId('eventScheduleSelect')
		.setPlaceholder('Select an Event')
		.addOptions(
			events.map((event) =>
				new StringSelectMenuOptionBuilder()
					.setLabel(event.name)
					.setValue(event.id),
			),
		);

	return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(eventSelect);
}

export function buildEventListComponents(
	events: Collection<Snowflake, GuildScheduledEvent>,
	action: string,
): [ActionRowBuilder<StringSelectMenuBuilder>, ActionRowBuilder<ButtonBuilder>] {
	let confirmCustomId = 'editEventButton';
	if (action.toLowerCase() === 'cancel') {
		confirmCustomId = 'cancelEventButton';
	}

	const selectRow = buildEventList(events);

	const confirm = new ButtonBuilder()
		.setCustomId(confirmCustomId)
		.setLabel('Next')
		.setStyle(ButtonStyle.Primary);
	const cancel = new ButtonBuilder()
		.setCustomId('cancelButton')
		.setLabel('Cancel')
		.setStyle(ButtonStyle.Secondary);

	const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(cancel, confirm);

	return [selectRow, buttonRow];
}