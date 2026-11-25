# FunLabBot

A Discord bot built with TypeScript, Node.js, and discord.js.

## Requirements
- [Node.js](https://nodejs.org/en/download/) (v16.9.0 or newer is recommended for discord.js)
- **Discord Bot Setup**: You will need to create an application in the [Discord Developer Portal](https://discord.com/developers/applications).
  - `BOT_TOKEN`: Found under your Application > Bot > Reset Token.
  - `clientId`: Found under your Application > OAuth2 > General > Client ID.
- **Discord Server**:
  - `guildId`: The ID of the Discord server you want to test in. You can get this by enabling Developer Mode in your Discord client settings, right-clicking the server icon, and selecting "Copy Server ID".
- **MongoDB Database**:
  - `MONGO_URI`: The connection string for your MongoDB database (e.g. from MongoDB Atlas).

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
     clientId=INSERT_CLIENT_ID
     guildId=INSERT_SERVER_ID
     MONGO_URI=INSERT_MONGO_URI
     ```

## Deploying Commands

Whenever you add or change slash commands, you need to register them with Discord's API:

- To deploy commands to a specific server (faster updates, recommended for testing):
  ```bash
  npm run deploy:guild
  ```
- To deploy commands globally (takes up to an hour to update across all servers):
  ```bash
  npm run deploy:global
  ```
- To clear registered commands:
  ```bash
  npm run commands:clear
  ```

## Running the Bot

### Development Mode
Runs the bot directly from TypeScript with live reload on file changes:
```bash
npm run dev
```

### Production Mode
Compile the TypeScript code to JavaScript and run the output:
```bash
# Build the project
npm run build

# Start the bot
npm start
```

## Other Scripts

- **Type check**: `npm run typecheck`
- **Lint**: `npm run lint`

