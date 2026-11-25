import {
	ChatInputCommandInteraction,
	SlashCommandBuilder,
	SlashCommandOptionsOnlyBuilder,
	SlashCommandSubcommandsOnlyBuilder,
} from 'discord.js';
export type SlashCommandData =
	| SlashCommandBuilder
	| SlashCommandOptionsOnlyBuilder
	| SlashCommandSubcommandsOnlyBuilder
	| Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;
export interface Command {
	data: SlashCommandData;
	execute: (interaction: ChatInputCommandInteraction) => Promise<void> | void;
	cooldown?: number;
	global?: boolean;
	[key: string]: unknown;
}