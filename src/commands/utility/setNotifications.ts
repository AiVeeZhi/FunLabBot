import {
	ChannelType,
	ChatInputCommandInteraction,
	InteractionContextType,
	MessageFlags,
	PermissionFlagsBits,
	SlashCommandBuilder,
} from 'discord.js';
import { setAnnouncementChannel } from '../../db/services/eventChannelService';
import { Command } from '../../types/command';

const data = new SlashCommandBuilder()
	.setName('set-notifications')
	.setDescription('Set the channel to send notifications to')
	.setContexts(InteractionContextType.Guild)
	.addChannelOption((option) =>
		option
			.setName('channel')
			.setDescription('the channel to send notifications to')
			.addChannelTypes(ChannelType.GuildText)
			.setRequired(true),
	)
	.setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

const command: Command = {
	global: true,
	data,
	async execute(interaction: ChatInputCommandInteraction): Promise<void> {
		if (!interaction.guild) {
			await interaction.reply({
				content: 'This command can only be used in a server.',
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		const channel = interaction.options.getChannel('channel', true);
        const channelName = channel.name ?? channel.id;

		if (await setAnnouncementChannel(interaction.guild, channel)) {
			await interaction.reply({
				content: `Successfully set notification channel to: ${channelName}`,
				flags: MessageFlags.Ephemeral,
			});
		} else {
			await interaction.reply({
				content: `There was an error setting notification channel to: ${channelName}`,
				flags: MessageFlags.Ephemeral,
			});
		}
	},
};

export default command;