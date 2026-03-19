const { SlashCommandBuilder, TextDisplayBuilder, MessageFlags } = require('discord.js');
const { getDeepDives, getSalutes, getTrivia } = require('../../service/drgAPIService.js');
const { getRandomInt } = require('../../util/helpers.js');

let salutesJson = null;
let triviaJson = null;
let deepDiveJson = null;

const data = new SlashCommandBuilder().setName('drg').setDescription('Get\'s Deep Rock Galactic related info')
    .addSubcommand(subcommand =>
        subcommand.setName('deepdives').setDescription('Gets current week\'s deepdives'))
    .addSubcommand(subcommand =>
        subcommand.setName('rocknstone').setDescription('ROCK AND STONE'))
    .addSubcommand(subcommand =>
        subcommand.setName('trivia').setDescription('Get random DRG related trivia')
    );

function getRandomValue(json) {
    const query = json.trivia || json.salutes || [];
    if (query.length === 0) return "No data found.";
    const max = query.length - 1;
    const randomNumber = getRandomInt(0, max);
    return query[randomNumber];
}

async function sendDeepDive(json) {
    const components = [];

    // Header Title
    components.push(
        new TextDisplayBuilder()
            .setContent(`# ⛏️ Weekly Deep Dives\n**Ends:** <t:${Math.floor(new Date(json.endTime) / 1000)}:R>`)
    );

    for (const variant of json.variants) {
        // Variant Header Section
        components.push(
            new TextDisplayBuilder().
                setContent(`## ${variant.type}: ${variant.name}\n**Biome:** ${variant.biome}`)
        );

        // Stages loop
        for (const stage of variant.stages) {
            const modifiers = [
                stage.warning ? `⚠️ ${stage.warning}` : null,
                stage.anomaly ? `✨ ${stage.anomaly}` : null
            ].filter(Boolean).join(' | ') || 'No modifiers';

            components.push(
                new TextDisplayBuilder().
                    setContent(
                        `**Stage ${stage.id}**\n` +
                        `• Primary: ${stage.primary}\n` +
                        `• Secondary: ${stage.secondary}\n` +
                        `*Modifiers: ${modifiers}*`
                    )
            );
        }
    }
    return components;
}

module.exports = {
    data: data,
    async execute(interaction) {
        await interaction.deferReply();
        switch (interaction.options.getSubcommand()) {
            case 'deepdives': {
                if (!deepDiveJson) {
                    deepDiveJson = await getDeepDives();
                } else {
                    const deepDiveEndTime = new Date(deepDiveJson.endTime);
                    if (Date.now() > deepDiveEndTime.getTime()) {
                        console.log('Deep Dives has reset, Retrieving latest info');
                        deepDiveJson = await getDeepDives();
                    }
                }
                const components = await sendDeepDive(deepDiveJson);
                await interaction.editReply({
                    components: components,
                    flags: MessageFlags.IsComponentsV2
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
    }

}