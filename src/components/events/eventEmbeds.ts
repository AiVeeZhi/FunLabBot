import {
	EmbedBuilder,
	GuildScheduledEvent,
	GuildTextBasedChannel,
	NewsChannel,
	PartialGuildScheduledEvent,
	TextChannel,
} from 'discord.js';

export const EVENTTYPES = {
	create: 'created',
	edit: 'updated',
	cancel: 'deleted',
} as const;

export type EventActionType = (typeof EVENTTYPES)[keyof typeof EVENTTYPES];

const COLORS: Record<EventActionType, number> = {
	created: 0x57f287,
	updated: 0xfee75c,
	deleted: 0xed4245,
};

const TITLES: Record<EventActionType, string> = {
	created: '🗓️ Event Created',
	updated: '✏️ Event Updated',
	deleted: '🗑️ Event Cancelled',
};

export function buildEventEmbed(
	type: EventActionType,
	event: GuildScheduledEvent | PartialGuildScheduledEvent,
): EmbedBuilder {
	const embed = new EmbedBuilder()
		.setColor(COLORS[type])
		.setTitle(TITLES[type])
		.addFields(
			{ name: 'Name', value: event.name ?? 'Unknown Event' },
			{
				name: 'Start',
				value: event.scheduledStartAt
					? `<t:${Math.floor(event.scheduledStartAt.getTime() / 1000)}:F>`
					: 'N/A',
				inline: true,
			},
			{
				name: 'End',
				value: event.scheduledEndAt
					? `<t:${Math.floor(event.scheduledEndAt.getTime() / 1000)}:F>`
					: 'N/A',
				inline: true,
			},
		);

	if (event.description) embed.setDescription(event.description);
	if (event.entityMetadata?.location) embed.addFields({ name: 'Location', value: event.entityMetadata.location });
	if (event.coverImageURL && event.coverImageURL()) embed.setThumbnail(event.coverImageURL()!);

	return embed;
}

export async function postEventEmbed(
	type: EventActionType,
	event: GuildScheduledEvent | PartialGuildScheduledEvent,
	channel: TextChannel | NewsChannel | GuildTextBasedChannel | null,
): Promise<void> {
	if (!channel) {
		console.error('[EventEmbed] Could not find channel.');
		return;
	}
	await channel.send({ embeds: [buildEventEmbed(type, event)] });
}