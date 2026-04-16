const { SlashCommandBuilder, MessageFlags, InteractionContextType } = require('discord.js');
const { buildEventModal } = require('../../components/events/eventModal.js');
const { getServerEvents } = require('../../util/serverMethods.js');
const { buildEventListComponents } = require('../../components/events/eventListSelectMenu.js');

const actions = Object.freeze({
    CREATE: 'create',
    EDIT: 'edit',
    CANCEL: 'cancel'
});

const data = new SlashCommandBuilder().setName('event').setDescription('Create, Modify, Delete Discord Events').setContexts(InteractionContextType.Guild)
    .addSubcommand(subcommand =>
        subcommand.setName('create').setDescription('Create a Discord event'))
    .addSubcommand(subcommand =>
        subcommand.setName('edit').setDescription('Modify an existing DIscord event'))
    .addSubcommand(subcommand =>
        subcommand.setName('cancel').setDescription('Remove a Discord Event')
    );

async function startEventActionFlow(interaction, action) {
    const events = await getServerEvents(interaction);
    if (!events) {
        await interaction.reply({
            content: 'There are no upcoming events',
            flags: MessageFlags.Ephemeral
        });
        return;
    }
    let response = null;
    if (action === actions.EDIT) {
        response = await interaction.reply({
            content: 'Select an event to modify',
            components: buildEventListComponents(events, action),
            flags: MessageFlags.Ephemeral,
            withResponse: true
        });
    } else {
        response = await interaction.reply({
            content: 'Select an event to cancel',
            components: buildEventListComponents(events, action),
            flags: MessageFlags.Ephemeral,
            withResponse: true
        });
    }

    let selectedEventId = null;
    const collector = response.resource.message.createMessageComponentCollector({
        filter: i => i.user.id === interaction.user.id,
        time: 60000
    });
    collector.on('collect', async i => {
        if (i.isStringSelectMenu() && i.customId === 'eventScheduleSelect') {
            selectedEventId = i.values[0];
            await i.deferUpdate();
        } else if (i.isButton() && (i.customId === 'editEventButton' || i.customId === 'cancelEventButton')) {
            if (!selectedEventId) {
                await i.reply({
                    content: 'Please select an event first',
                    flags: MessageFlags.Ephemeral
                });
                return;
            }
            
            if (i.customId === 'editEventButton') {
                console.log(`Selected Event ID: ${selectedEventId}`);
                const modal = await buildEventModal(actions.EDIT, i, selectedEventId);
                await i.showModal(modal);
                await interaction.deleteReply();
                collector.stop();
            } else if (i.customId === 'cancelEventButton') {
                const guild = interaction.client.guilds.cache.get(interaction.guildId);
                if (guild) {
                    try {
                        const event = await guild.scheduledEvents.fetch(selectedEventId);
                        await event.delete();
                        await i.update({ content: `Event **${event.name}** was successfully cancelled!`, components: [] });
                        collector.stop('deleted');
                    } catch (error) {
                        console.error('Error cancelling event', error);
                        await i.reply({ content: 'There was an error cancelling the event.', flags: MessageFlags.Ephemeral });
                    }
                }
            }
        } else if (i.isButton() && i.customId === 'cancelButton') {
            await i.deferUpdate();
            collector.stop('cancelled');
        }
    });
    collector.on('end', async (collected, reason) => {
        if (reason === 'cancelled') {
            await interaction.editReply({
                content: 'Event selection cancelled',
                components: []
            });
        } else if (reason === 'time') {
            await interaction.editReply({
                content: 'Event selection timed out',
                components: []
            });
        }
    });
}

module.exports = {
    global: true,
    data: data,
    async execute(interaction) {
        switch (interaction.options.getSubcommand()) {
            case actions.CREATE: {
                const modal = await buildEventModal(actions.CREATE, interaction);
                await interaction.showModal(modal);
                break;
            }
            case actions.EDIT: {
                await startEventActionFlow(interaction, actions.EDIT);
                break;
            }
            case actions.CANCEL: {
                await startEventActionFlow(interaction, actions.CANCEL);
                break;
            }
        }
    }
}