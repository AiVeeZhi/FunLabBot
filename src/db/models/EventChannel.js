const { Schema, model } = require('mongoose');

const eventChannelSchema = new Schema({
    guildId: { type: String, required: true, unique: true},
    channelId: {type: String},
    channelName:{type: String}
});

module.exports = model('EventChannel', eventChannelSchema);