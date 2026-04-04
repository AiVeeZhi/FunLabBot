# FunLabBot

A Discord bot built with Node.js and discord.js.

## Requirements
- [Node.js](https://nodejs.org/en/download/) (v16.9.0 or newer is recommended for discord.js)

## Setup

1. **Clone the repository** (if you haven't already) and navigate to the bot's folder.
   ```bash
   cd FunLabBot
   ```

2. **Install dependencies**:
   Run the following command to install all the required packages (like `discord.js`, `dotenv`, etc.).
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   There is a `.env.example` file provided in the root directory.
   - Rename `.env.example` to `.env`.
   - Open `.env` and fill in your app details:
     ```env
     BOT_TOKEN=INSERT_DISCORD_BOT_TOKEN
     clientId=INSTERT_CLIENT_ID
     guildId=INSERT_SERVER_ID
     ```

## Deploying Commands

Whenever you add or change slash commands, you need to register them with Discord's API. There are two deployment scripts you can use:

- To deploy commands to a specific server (faster updates, recommended for testing):
  ```bash
  node scripts/guild-deploy-commands.js
  ```
- To deploy commands globally (takes up to an hour to update across all servers):
  ```bash
  node scripts/global-deploy-commands.js
  ```

## Running the Bot

Once everything is set up, you can start the bot by running:
```bash
node src/index.js
```
