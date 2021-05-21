import { MessageOptions } from 'discord.js';
import { Context } from 'lib/extensions';
import { Command } from 'lib/objects';

export default class Util extends Command {
	constructor() {
		super('ping', {
			name: 'Ping',
			aliases: ['ping', 'pong'],
			channel: 'guild',
			description: 'Checks the average latency across all shards',
			category: 'Utility',
		});
	}

	exec = (ctx: Context): MessageOptions => ({
		reply: { messageReference: ctx.id, failIfNotExists: false },
		content: `**Ponge:** ${ctx.guild.shard.ping}ms`
	});
}
