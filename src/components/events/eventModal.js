const { ModalBuilder, TextInputBuilder, TextInputStyle, LabelBuilder } = require('discord.js');
const { getServerEventById } = require('../../util/serverMethods.js');

async function buildEventModal(action, interaction, eventID) {
    let event = null;
    if (eventID && interaction) {
        event = await getServerEventById(interaction, eventID);
    }

    const eventName = event ? event.name : '';
    const eventLocation = event?.entityMetadata?.location ? event.entityMetadata.location : '';
    const eventDescription = event && event.description ? event.description : '';
    
    const startDateText = event && event.scheduledStartAt ? event.scheduledStartAt.toLocaleString('en-US', { timeZone: 'America/Chicago', month: 'numeric', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' }).replace(',',' ') : '';
    const endDateText = event && event.scheduledEndAt ? event.scheduledEndAt.toLocaleString('en-US', { timeZone: 'America/Chicago', month: 'numeric', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' }).replace(',',' ') : '';

    const eventNameInput = new TextInputBuilder()
        .setCustomId('eventName')
        .setStyle(TextInputStyle.Short)
        .setMaxLength(25)
        .setValue(action === 'edit' ? eventName : '');

    const eventNameLabel = new LabelBuilder()
        .setLabel('Event Name')
        .setTextInputComponent(eventNameInput);

    const locationInput = new TextInputBuilder()
        .setCustomId('eventLocation')
        .setStyle(TextInputStyle.Short)
        .setMaxLength(100)
        .setValue(action === 'edit' ? eventLocation : '');

    const locationLabel = new LabelBuilder()
        .setLabel('Location')
        .setTextInputComponent(locationInput);

    // Time Input (Must be a format JS can parse)
    const startDateInput = new TextInputBuilder()
        .setCustomId('eventStartDate')
        .setPlaceholder('5/2 3:30pm')
        .setStyle(TextInputStyle.Short)
        .setMaxLength(25)
        .setValue(action === 'edit' ? startDateText : '');

    const startDateLabel = new LabelBuilder()
        .setLabel('Start Time')
        .setDescription('Provide Start date and time in format MM/DD HH:MM am or MM/DD/YYYY HH:MM pm. Assumes CST')
        .setTextInputComponent(startDateInput);

    const endDateInput = new TextInputBuilder()
        .setCustomId('eventEndDate')
        .setPlaceholder('11/23 11am')
        .setStyle(TextInputStyle.Short)
        .setMaxLength(25)
        .setValue(action === 'edit' ? endDateText : '');

    const endDateLabel = new LabelBuilder()
        .setLabel('End Date')
        .setDescription('Provide Start date and time in format MM/DD HH:MM am or MM/DD/YYYY HH:MM pm. Assumes CST')
        .setTextInputComponent(endDateInput);

    const descriptionInput = new TextInputBuilder()
        .setCustomId('eventDescription')
        .setStyle(TextInputStyle.Paragraph)
        .setMaxLength(1000)
        .setRequired(false)
        .setValue(action === 'edit' ? eventDescription : '');

    const descriptionLabel = new LabelBuilder()
        .setLabel('Description')
        .setTextInputComponent(descriptionInput);

    const modal = new ModalBuilder()
        .setCustomId(action === 'edit' ? `editEventModal_${eventID}` : 'createEventModal')
        .setTitle(action === 'edit' ? 'Edit Event' : 'Create a New Event');

    modal.addLabelComponents(eventNameLabel, locationLabel, startDateLabel, endDateLabel, descriptionLabel);

    return modal;
}

module.exports = { buildEventModal };
