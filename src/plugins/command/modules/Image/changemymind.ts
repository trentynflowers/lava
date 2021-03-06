import { MessageOptions, FileOptions } from 'discord.js';
import { Command, Context } from 'lava/index';

export default class extends Command {
	constructor() {
		super('changemymind', {
			aliases: ['changemymind'],
			channel: 'guild',
			clientPermissions: ['ATTACH_FILES'],
			name: 'Change My Mind',
			args: [
				{ 
					id: 'text', 
					type: 'string', 
					default: 'You need some text idiot.' 
				},
			],
		});
	}

	exec(ctx: Context, args: { text: string }) {
		return ctx.client.memer.generate('changemymind', {
			text: args.text
		}).then((buffer: Buffer) => ctx.reply({
			files: [buffer]
		})).catch((e: Error) => ctx.reply({
			content: e.message || 'Something went wrong.'
		}));
	}
}