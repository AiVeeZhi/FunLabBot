const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

function buildEventList(events) {
    const eventSelect = new StringSelectMenuBuilder()
        .setCustomId('eventScheduleSelect')
        .setPlaceholder('Select an Event')
        .addOptions(
            events.map(event =>
                new StringSelectMenuOptionBuilder()
                    .setLabel(event.name)
                    .setValue(event.id)
            )
        );

    const selectRow = new ActionRowBuilder().addComponents(eventSelect);

    return selectRow;
}

function buildEventListComponents(events, action) {

    let confirmCustomId;
    if (action.toLowerCase() === 'edit') {
        confirmCustomId = 'editEventButton';
    } else if (action.toLowerCase() === 'cancel') {
        confirmCustomId = 'cancelEventButton';
    }

    const selectRow = buildEventList(events);

    const confirm = new ButtonBuilder().setCustomId(`${confirmCustomId}`).setLabel('Next').setStyle(ButtonStyle.Primary);
    const cancel = new ButtonBuilder().setCustomId('cancelButton').setLabel('Cancel').setStyle(ButtonStyle.Secondary);

    const buttonRow = new ActionRowBuilder().addComponents(cancel, confirm);

    const editComponents = [selectRow, buttonRow];

    return editComponents;
}


module.exports = {
    buildEventListComponents,
}
