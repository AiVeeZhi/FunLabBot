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

const event: BotEvent<Events.GuildScheduledEventDelete> = {
	name: Events.GuildScheduledEventDelete,
	async execute(
		guildScheduleEvent: GuildScheduledEvent | PartialGuildScheduledEvent,
	): Promise<void> {
		console.log(`Event cancelled: ${guildScheduleEvent.name ?? 'Unknown Event'}`);
		if (!guildScheduleEvent.guild) return;

		const channel = await getAnnouncementChannel(guildScheduleEvent.guild);

		if (channel && 'send' in channel) {
			await postEventEmbed(
				EVENTTYPES.cancel,
				guildScheduleEvent,
				channel as TextChannel | NewsChannel,
			);
		} else {
			console.log(
				`Could not find an appropriate announcement channel for guild: ${guildScheduleEvent.guild.name}`,
			);
		}
	},
};

export default event;