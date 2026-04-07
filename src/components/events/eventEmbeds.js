const { EmbedBuilder } = require('discord.js');

const EVENTTYPES = {
    create: 'created',
    edit: 'updated',
    cancel: 'deleted'
};

const COLORS = {
    created: 0x57f287, // green
    updated: 0xfee75c, // yellow
    deleted: 0xed4245, // red
};

const TITLES = {
    created: '🗓️ Event Created',
    updated: '✏️ Event Updated',
    deleted: '🗑️ Event Cancelled',
};

function buildEventEmbed(type, event) {
    const embed = new EmbedBuilder()
        .setColor(COLORS[type])
        .setTitle(TITLES[type])
        .addFields(
            { name: 'Name', value: event.name },
            {
                name: 'Start',
                value: event.scheduledStartAt
                    ? `<t:${Math.floor(event.scheduledStartAt.getTime() / 1000)}:F>`
                    : 'N/A',
                inline: true,
            },
            {
                name: 'End',
                value: event.scheduledEndAt
                    ? `<t:${Math.floor(event.scheduledEndAt.getTime() / 1000)}:F>`
                    : 'N/A',
                inline: true,
            },
        );

    if (event.description) embed.setDescription(event.description);
    if (event.entityMetadata?.location) embed.addFields({ name: 'Location', value: event.entityMetadata.location });
    if (event.coverImageURL()) embed.setThumbnail(event.coverImageURL());

    return embed;
}

async function postEventEmbed(type, event, channel) {
    if (!channel) {
        console.error(`[EventEmbed] Could not find channel ${channel}.`);
        return;
    }
    await channel.send({ embeds: [buildEventEmbed(type, event)] });
}

module.exports = { postEventEmbed, EVENTTYPES};
