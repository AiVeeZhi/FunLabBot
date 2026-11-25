import {
	ChatInputCommandInteraction,
	MessageFlags,
	SlashCommandBuilder,
	TextDisplayBuilder,
} from 'discord.js';
import { getDeepDives, getSalutes, getTrivia } from '../../service/drgAPIService';
import { getRandomInt } from '../../util/helpers';
import { DeepDiveResponse, DRGListResponse } from '../../types/drg';
import { Command } from '../../types/command';

let salutesJson: DRGListResponse | null = null;
let triviaJson: DRGListResponse | null = null;
let deepDiveJson: DeepDiveResponse | null = null;

const data = new SlashCommandBuilder()
	.setName('drg')
	.setDescription("Get Deep Rock Galactic related info")
	.addSubcommand((subcommand) =>
		subcommand.setName('deepdives').setDescription("Gets current week's deepdives"),
	)
	.addSubcommand((subcommand) =>
		subcommand.setName('rocknstone').setDescription('ROCK AND STONE'),
	)
	.addSubcommand((subcommand) =>
		subcommand.setName('trivia').setDescription('Get random DRG related trivia'),
	);

function getRandomValue(json: DRGListResponse): string {
	const query = json.trivia || json.salutes || [];
	if (query.length === 0) return 'No data found.';
	const max = query.length - 1;
	const randomNumber = getRandomInt(0, max);
	return query[randomNumber];
}

function sendDeepDive(json: DeepDiveResponse): TextDisplayBuilder[] {
	const components: TextDisplayBuilder[] = [];

	// Header Title
	components.push(
		new TextDisplayBuilder().setContent(
			`# ⛏️ Weekly Deep Dives\n**Ends:** <t:${Math.floor(new Date(json.endTime).getTime() / 1000)}:R>`,
		),
	);

	for (const variant of json.variants) {
		components.push(
			new TextDisplayBuilder().setContent(
				`## ${variant.type}: ${variant.name}\n**Biome:** ${variant.biome}`,
			),
		);

		for (const stage of variant.stages) {
			const modifiers =
				[
					stage.warning ? `⚠️ ${stage.warning}` : null,
					stage.anomaly ? `✨ ${stage.anomaly}` : null,
				]
					.filter(Boolean)
					.join(' | ') || 'No modifiers';

			components.push(
				new TextDisplayBuilder().setContent(
					`**Stage ${stage.id}**\n` +
						`• Primary: ${stage.primary}\n` +
						`• Secondary: ${stage.secondary}\n` +
						`*Modifiers: ${modifiers}*`,
				),
			);
		}
	}
	return components;
}

const command: Command = {
	global: true,
	data,
	async execute(interaction: ChatInputCommandInteraction): Promise<void> {
		await interaction.deferReply();
		const subcommand = interaction.options.getSubcommand();

		switch (subcommand) {
			case 'deepdives': {
				if (!deepDiveJson) {
					deepDiveJson = await getDeepDives();
				} else {
					const deepDiveEndTime = new Date(deepDiveJson.endTime);
					if (Date.now() > deepDiveEndTime.getTime()) {
						console.log('Deep Dives has reset, retrieving latest info');
						deepDiveJson = await getDeepDives();
					}
				}
				const components = sendDeepDive(deepDiveJson);
				await interaction.editReply({
					components,
					flags: MessageFlags.IsComponentsV2,
				});
				break;
			}
			case 'rocknstone': {
				if (!salutesJson) salutesJson = await getSalutes();
				const reply = getRandomValue(salutesJson);
				await interaction.editReply(`${reply}`);
				break;
			}
			case 'trivia': {
				if (!triviaJson) triviaJson = await getTrivia();
				const reply = getRandomValue(triviaJson);
				await interaction.editReply(`${reply}`);
				break;
			}
		}
	},
};

export default command;