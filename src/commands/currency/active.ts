import { MessageOptions } from 'discord.js';
import { MemberPlus } from 'lib/extensions/member';
import { Context } from 'lib/extensions/message';
import { Command } from 'lib/handlers/command';

export default class Currency extends Command {
  constructor() {
    super('profile', {
      aliases: ['profile', 'level'],
      channel: 'guild',
      description: "View basic info about your currency progress.",
      category: 'Currency',
      cooldown: 1e3,
      args: [
        {
          id: 'member',
          type: 'member',
          default: (m: Context) => m.member,
        },
      ],
    });
  }

  public async exec(
    ctx: Context<{ member: MemberPlus }>
  ): Promise<string | MessageOptions> {
    const {
      handlers: { item },
      util: { parseTime },
    } = this.client;
    const { data } = await ctx.db.fetch(ctx.args.member.user.id, ctx.author.id === ctx.args.member.user.id);
    const stamp = ctx.createdTimestamp;
    const actives = data.items
      .filter((i) => i.expire > stamp)
      .map((i) => {
        const it = item.modules.get(i.id);
        const expire = parseTime(Math.floor((i.expire - stamp) / 1e3));

        return `**${it.emoji} ${it.name}** — expires in ${expire}`;
      });

    const other = [
      `**${data.pocket}** in pocket`,
      `**${data.vault}** in vault`,
      `**${this.client.db.currency.utils.calcMulti(ctx, data).total}%** multiplier`,
    ];

    if (actives.length < 1) {
      return { replyTo: ctx, content: `${ctx.args.member.user.id === ctx.author.id ? 'You' : 'They'} don't have active items!` };
    }

    return { embed: {
      title: `${ctx.args.member.user.username}'s profile`,
      color: 'BLURPLE', fields: [
        { name: 'Active Items', value: actives.join('\n') },
        { name: 'Other', value: other.join('\n') },
      ]
    }};
  }
}
