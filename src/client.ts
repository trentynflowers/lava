import 'module-alias/register';

import { LavaClient, CommandHandler, ListenerHandler, Command, Listener } from './library';
import { ClientOptions, Intents } from 'discord.js';
import { join } from 'path';

const bot = new LavaClient({ intents: Intents.ALL });

bot.commandHandler = new CommandHandler(bot, { 
	directory: join(__dirname, 'modules', 'commands'),
	classToHandle: Command,
	useNames: true,
	prefix: ['lava'],
}).loadAll();

bot.listenerHandler = new ListenerHandler(bot, {
	directory: join(__dirname, 'modules', 'listeners'),
	automateCategories: true,
	classToHandle: Listener,
	useNames: true,
}).loadAll();

bot.login(process.env.DISCORD_TOKEN);