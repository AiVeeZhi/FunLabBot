const EventChannel = require('../models/EventChannel.js');

/**
 * Retrieves the announcement channel for a designated guild.
 * Defaults to the guild's system channel if no explicit channel is configured or found.
 * 
 * @param {import('discord.js').Guild} guild The Discord guild object
 * @returns {Promise<import('discord.js').TextChannel | import('discord.js').NewsChannel | null>}
 */
async function getEventAnnouncementChannel(guild) {
    const eventChannel = await EventChannel.findOne({ guildId: guild.id });

    if (eventChannel) {
        try {
            const channel = await guild.channels.fetch(eventChannel.channelId);
            if (channel) return channel;
        } catch (error) {
            console.error(`Failed to fetch channel ${eventChannel.channelId} for guild ${guild.id}:`, error);
        }
    }

    console.log(`Channel not set or invalid for guild ${guild.name}, defaulting to system channel.`);
    return guild.systemChannel || null;
}

module.exports = { getEventAnnouncementChannel };
