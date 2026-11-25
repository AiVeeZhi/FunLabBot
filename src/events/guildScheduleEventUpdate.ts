import {
	Events,
	GuildScheduledEvent,
	NewsChannel,
	PartialGuildScheduledEvent,
	TextChannel,
} from 'discord.js';
import { postEventEmbed, EVENTTYPES } from '../components/events/eventEmbeds';
import { getAnnouncementChannel } from '../db/services/eventChannelService';
import { BotEvent } from '../types/event';

const event: BotEvent<Events.GuildScheduledEventUpdate> = {
	name: Events.GuildScheduledEventUpdate,
	async execute(
		_oldEvent: GuildScheduledEvent | PartialGuildScheduledEvent | null,
		newEvent: GuildScheduledEvent,
	): Promise<void> {
		console.log(`Event updated: ${newEvent.name}`);
		if (!newEvent.guild) return;

		const channel = await getAnnouncementChannel(newEvent.guild);

		if (channel && 'send' in channel) {
			await postEventEmbed(
				EVENTTYPES.edit,
				newEvent,
				channel as TextChannel | NewsChannel,
			);
		} else {
			console.log(
				`Could not find an appropriate announcement channel for guild: ${newEvent.guild.name}`,
			);
		}
	},
};

export default event;