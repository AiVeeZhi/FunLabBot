const { Events } = require('discord.js');
const {postEventEmbed, EVENTTYPES} = require('../components/events/eventEmbeds.js');
const { getAnnouncementChannel } = require('../db/services/eventChannelService.js');

module.exports = {
    name: Events.GuildScheduledEventDelete,
    async execute(guildScheduleEvent) {
        console.log(`Event cancelled: ${guildScheduleEvent.name}`);

        const channel = await getAnnouncementChannel(guildScheduleEvent.guild);
        console.log(`channel: ${channel}`);

        if (channel) {
            await postEventEmbed(EVENTTYPES.cancel, guildScheduleEvent, channel);
        } else {
            console.log(`Could not find an appropriate announcement channel for guild: ${guildScheduleEvent.guild.name}`);
        }
    },
};