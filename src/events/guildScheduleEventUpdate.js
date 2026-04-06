const { Events } = require('discord.js');
const {postEventEmbed, EVENTTYPES} = require('../components/events/eventEmbeds.js');
const { getEventAnnouncementChannel } = require('../db/services/eventChannelService.js');

module.exports = {
    name: Events.GuildScheduledEventUpdate,
    async execute(guildScheduleEvent) {
        console.log(`Event updated: ${guildScheduleEvent.name}`);

        const channel = await getEventAnnouncementChannel(guildScheduleEvent.guild);
        console.log(`channel: ${channel}`);

        if (channel) {
            await postEventEmbed(EVENTTYPES.edit, guildScheduleEvent, channel);
        } else {
            console.log(`Could not find an appropriate announcement channel for guild: ${guildScheduleEvent.guild.name}`);
        }
    },
};