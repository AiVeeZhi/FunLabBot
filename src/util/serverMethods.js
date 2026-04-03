const getServerEvents = async (interaction) => {
    const guildId = interaction.guildId;
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
};

const getServerEventById = async (interaction, eventId) => {
    const guildId = interaction.guildId;
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

module.exports = {
    getServerEvents,
    getServerEventById
};