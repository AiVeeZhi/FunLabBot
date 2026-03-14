require('dotenv').config();

const { REST, Routes } = require('discord.js');
const { clientId, guildId, BOT_TOKEN } = process.env;
const fs = require('node:fs');
const path = require('node:path');

const rest = new REST().setToken(BOT_TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    // For guild-based commands
    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: [] },
    );

    // For global commands (uncomment the following lines and comment the guild ones if needed)
    // await rest.put(
    //   Routes.applicationCommands(CLIENT_ID), 
    //   { body: [] }
    // );

    console.log('Successfully deleted all application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();