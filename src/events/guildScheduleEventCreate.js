const { Events } = require('discord.js');
const {postEventEmbed, EVENTTYPES} = require('../components/events/eventEmbeds.js');
const { getAnnouncementChannel } = require('../db/services/eventChannelService.js');

module.exports = {
    name: Events.GuildScheduledEventCreate,
    async execute(guildScheduleEvent) {
        console.log(`New event created: ${guildScheduleEvent.name}`);

        const channel = await getAnnouncementChannel(guildScheduleEvent.guild);

        if (channel) {
            await postEventEmbed(EVENTTYPES.create, guildScheduleEvent, channel);
        } else {
            console.log(`Could not find an appropriate announcement channel for guild: ${guildScheduleEvent.guild.name}`);
        }
    },
};