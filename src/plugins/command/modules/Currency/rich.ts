import { Command, Context, CurrencyModel, CurrencyEntry } from 'lava/index';
import { Snowflake, GuildMember, Collection } from 'discord.js';

export default class extends Command {
	constructor() {
		super('rich', {
			aliases: ['rich'],
			category: 'Currency',
			clientPermissions: ['EMBED_LINKS'],
			description: 'View the top rich users of currency.',
			name: 'Rich'
		});
	}

	top(members: Collection<Snowflake, GuildMember>, amount = 10) {
		const docs = CurrencyModel.find({ 'props.pocket': { $gte: 1 } }).sort({ 'props.pocket': 'desc' }).exec();
		return docs.then(docs => docs.map(doc => new CurrencyEntry(this.client, doc))
			.filter(doc => members.has(doc.data._id as Snowflake))
			.slice(0, amount));
	}

	async exec(ctx: Context) {		
		return ctx.channel.send({ embed: {
			author: { name: 'richest users in this server' },
			color: 'RED', description: await this.top(ctx.guild.members.cache)
				.then(docs => docs.map((doc, i) => {
					const user = ctx.client.users.cache.get(doc.data._id as Snowflake)?.tag ?? 'LOL WHO DIS';
					const emoji = Array(3).fill('coin')[i] ?? 'small_red_triangle';
					return `**:${emoji}: ${doc.props.pocket.toLocaleString()}** - ${user}`;
				}).join('\n'))
		}});
	}
}