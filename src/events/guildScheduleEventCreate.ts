import { Events, GuildScheduledEvent, TextChannel, NewsChannel } from 'discord.js';
import { postEventEmbed, EVENTTYPES } from '../components/events/eventEmbeds';
import { getAnnouncementChannel } from '../db/services/eventChannelService';
import { BotEvent } from '../types/event';

const event: BotEvent<Events.GuildScheduledEventCreate> = {
	name: Events.GuildScheduledEventCreate,
	async execute(guildScheduleEvent: GuildScheduledEvent): Promise<void> {
		console.log(`New event created: ${guildScheduleEvent.name}`);
		if (!guildScheduleEvent.guild) return;

		const channel = await getAnnouncementChannel(guildScheduleEvent.guild);

		if (channel && 'send' in channel) {
			await postEventEmbed(
				EVENTTYPES.create,
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