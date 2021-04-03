import { CurrencyProfile } from '@lib/interface/mongo/currency';
import { Document } from 'mongoose';
import { UserPlus } from './user';
import { Command } from '@lib/handlers/command';
import { Lava } from '@lib/Lava';
import {
  APIMessageContentResolvable,
  StringResolvable,
  MessageAdditions,
  MessageOptions,
  MessageEmbed,
  NewsChannel,
  TextChannel,
  APIMessage,
  Structures,
  DMChannel,
  Message,
} from 'discord.js';

type TextableChannel = DMChannel | TextChannel | NewsChannel;

export class MessagePlus extends Message {
  author: UserPlus;
  client: Lava;

  constructor(client: Lava, data: object, channel: TextableChannel) {
    super(client, data, channel);
  }

  get isGuild(): boolean {
    return Boolean(this.guild.id);
  }

  get isTextable(): boolean {
    return this.channel instanceof TextChannel;
  }

  fetchDB(id: string) {
    return this.client.db.currency.fetch(id);
  }

  dbAdd(id: string, key: keyof CurrencyProfile, amount: number) {
    return this.client.db.currency.add(id, key, amount);
  }

  dbRemove(id: string, key: keyof CurrencyProfile, amount: number) {
    return this.client.db.currency.remove(id, key, amount);
  }

  embed(data: MessageEmbed): Promise<Message> {
    const embed = data instanceof MessageEmbed ? data : new MessageEmbed(data);
    return this.channel.send({ embed });
  }
}

Structures.extend('Message', () => MessagePlus);
