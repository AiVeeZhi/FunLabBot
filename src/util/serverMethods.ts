import {
	BaseInteraction,
	Collection,
	GuildScheduledEvent,
	Snowflake,
} from 'discord.js';

export async function getServerEvents(
	interaction: BaseInteraction,
): Promise<Collection<Snowflake, GuildScheduledEvent> | null> {
	const { guildId } = interaction;
	if (!guildId) return null;
	const guild = interaction.client.guilds.cache.get(guildId);
	if (!guild) {
		console.error('Could not find guild information');
		return null;
	}
	try {
		return await guild.scheduledEvents.fetch();
	} catch (error) {
		console.error('Error fetching scheduled events', error);
		return null;
	}
}
export async function getServerEventById(
	interaction: BaseInteraction,
	eventId: string,
): Promise<GuildScheduledEvent | null> {
	const { guildId } = interaction;
	if (!guildId) return null;
	const guild = interaction.client.guilds.cache.get(guildId);
	if (!guild) {
		console.error('Could not find guild information');
		return null;
	}
	try {
		return await guild.scheduledEvents.fetch(eventId);
	} catch (error) {
		console.error('Error fetching scheduled event', error);
		return null;
	}
}