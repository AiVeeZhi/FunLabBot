import { Guild, GuildBasedChannel, TextChannel, NewsChannel } from 'discord.js';
import { EventChannel } from '../models/EventChannel';

/**
 * Retrieves the announcement channel for a designated guild.
 * Defaults to the guild's system channel if no explicit channel is configured or found.
 */
export async function getAnnouncementChannel(
	guild: Guild,
): Promise<GuildBasedChannel | TextChannel | NewsChannel | null> {
	const eventChannel = await EventChannel.findOne({ guildId: guild.id });

	if (eventChannel && eventChannel.channelId) {
		try {
			const channel = await guild.channels.fetch(eventChannel.channelId);
			if (channel) return channel;
		} catch (error) {
			console.error(
				`Failed to fetch channel ${eventChannel.channelId} for guild ${guild.id}:`,
				error,
			);
		}
	}

	console.log(`Channel not set or invalid for guild ${guild.name}, defaulting to system channel.`);
	return guild.systemChannel || null;
}

export async function setAnnouncementChannel(
	guild: Guild,
	channel: { id: string; name?: string | null },
): Promise<boolean> {
	try {
		const result = await EventChannel.findOneAndUpdate(
			{ guildId: guild.id },
			{
				channelId: channel.id,
				channelName: channel.name,
			},
			{
				upsert: true,
				returnDocument: 'after',
				runValidators: true,
			},
		);
		console.log(`Successfully updated db: ${result}`);
		return true;
	} catch (error) {
		console.error(
			`Error updating Notification Channel ${channel.id} for guild ${guild.id}:`,
			error,
		);
		return false;
	}
}