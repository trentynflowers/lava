import { Context } from 'lib/extensions/message';
import { Command } from 'lib/handlers/command';
import {
  PermissionOverwriteOption,
  MessageOptions,
  GuildChannel,
  TextChannel,
  Role,
} from 'discord.js';

type ContextPlus = Context<{
  interval: number;
  role: Role;
}>;

export default class Util extends Command {
  constructor() {
    super('hunlock', {
      aliases: ['hunlock', 'hul'],
      channel: 'guild',
      userPermissions: ['MANAGE_MESSAGES'],
      description: 'Unlocks the heist channel if you have right permissions',
      category: 'Utility',
      args: [
        {
          id: 'role',
          type: 'role',
          default: (m: Context) => m.guild.roles.cache.get(m.guild.id),
        },
        {
          id: 'interval',
          type: 'number',
          default: 10,
        },
      ],
    });
  }

  private embed(display: number, role: Role, color?: string): any {
    return {
      color: color || 'ORANGE',
      title: `Unlocking In...`,
      description: `**${display}** seconds.`,
      footer: {
        text: `Requirement: ${role.name}`,
        iconURL: role.guild.iconURL({ dynamic: true }),
      },
    };
  }

  async exec(ctx: ContextPlus): Promise<MessageOptions> {
    await ctx.delete().catch(() => {});
    const { role, interval } = ctx.args;
    const { sleep } = this.client.util;
    if (!role) return;

    let num = 60;
    let msg = await ctx.send({
      embed: this.embed(num, role, 'ORANGE'),
    });

    const run = async (int: number) => {
      if (num === 10) {
        await sleep(7e3);
        await msg.edit({ embed: this.embed(3, role, 'RED') });
        await sleep(1e3);
        await msg.edit({ embed: this.embed(2, role, 'RED') });
        await sleep(1e3);
        await msg.edit({ embed: this.embed(1, role, 'RED') });
        await sleep(1e3);
        await msg.edit({ embed: this.embed(0, role, 'RED') });
        return num;
      }

      await sleep(int * 1e3);
      num -= 10;
      msg = (await msg.edit({
        embed: this.embed(num, role, 'ORANGE'),
      })) as ContextPlus;
      return await run(int);
    };

    await run(interval);

    const reason = `Heist Unlock — ${msg.author.tag}`;
    const perms: PermissionOverwriteOption = { SEND_MESSAGES: true };
    (msg.channel as TextChannel).updateOverwrite(role.id, perms, reason);
    this.client.util.heists.set(msg.channel.id, role);

    return {
      embed: {
        description: `**Unlocked for ${role.toString()} role.**`,
        title: `Channel Unlocked`,
        color: 'GREEN',
        footer: {
          text: ctx.guild.name,
          iconURL: ctx.guild.iconURL({ dynamic: true }),
        },
      },
    };
  }
}
