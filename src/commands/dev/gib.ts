import { UserPlus, MemberPlus, Context } from 'lib/extensions';
import { MessageOptions } from 'discord.js';
import { Argument } from 'discord-akairo';
import { Document } from 'mongoose';
import { Command } from 'lib/handlers/command';
import config from 'config/index' ;

export default class Currency extends Command {
  constructor() {
    super('gib', {
      aliases: ['gib', 'g'],
      description: 'Gib coins to users.',
      category: 'Dev',
      ownerOnly: true,
      args: [
        {
          id: 'amount',
          type: 'number',
          unordered: true,
        },
        {
          id: 'member',
          type: 'member',
          unordered: true,
        },
      ],
    });
  }

  public async exec(ctx: Context<{ amount: number; member: MemberPlus }>) {
    const { member, amount } = ctx.args;
    const { maxSafePocket } = config.currency;
    const { user } = member;
    if (!member || !amount) return;

    const entry = await ctx.db.fetch(member.user.id, false);
    if (isNaN(amount)) return 'Needs to be a whole number yeah?';
    let { pocket } = await entry.addPocket(amount).updateItems().save();
    await ctx.react('✅');
  }
}