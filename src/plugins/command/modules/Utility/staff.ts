import { Command, Context } from 'lava/index';
import { Flag } from 'discord-akairo';

export default class extends Command {
	constructor() {
		super('staff', {
			aliases: ['staff', 's'],
			description: 'Get yo ash up and spam deez commands owo',
			name: 'Staph',
			usage: '{command} --demote me'
		});
	}

	*args(ctx: Context) {
		const { modules } = ctx.client.handlers.command;
		const subs = this.subCommands.filter(c => c.parent === this.id);
		const sub: string = yield [...subs.map(s => [s.id])];

		return sub ? Flag.continue(sub) : null;
	}

	exec(ctx: Context, args: any) {
		ctx.client.console.log('Client', args);
		return ctx.reply('what');
	}
}