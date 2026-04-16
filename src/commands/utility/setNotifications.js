const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, MessageFlags, InteractionContextType } = require('discord.js');
const { setAnnouncementChannel } = require('../../db/services/eventChannelService.js');

const data = new SlashCommandBuilder()
    .setName('set-notifications')
    .setDescription('Set the channel to send notifications to')
    .setContexts(InteractionContextType.Guild)
    .addChannelOption((option) => option
        .setName('channel')
        .setDescription('the channel to send notifications to')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

module.exports = {
    global:true,
    data: data,
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');

        //Store channel id and name to EventChannel DB
        if (await setAnnouncementChannel(interaction.guild, channel)) {
            await interaction.reply({
                content: `Successfully set notification channel to: ${channel.name}`,
                flags: MessageFlags.Ephemeral
            });
        } else {
            await interaction.reply({
                content: `There was an error setting notification channel to: ${channel.name}`,
                flags: MessageFlags.Ephemeral
            });
        }
    }
};