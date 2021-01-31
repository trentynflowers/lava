import { 
	Message, Guild, Collection, GuildMember, User, Snowflake,
	CollectorFilter, MessageEmbed, MessageCollector
} from 'discord.js'
import {
	Client, 
	SpawnConfig,
	SpawnVisuals,
	AkairoModule,
	Spawn as TypeSpawn
} from 'discord-akairo'
import Lava from 'discord-akairo'
import SpawnProfile from './spawns/model'

export default class Spawn extends AkairoModule implements TypeSpawn {
	public client: Client;
	public answered: Collection<Snowflake, User>;
	public spawn: SpawnVisuals;
	public config: SpawnConfig;
	public constructor(
		client: Client,
		config: SpawnConfig,
		visuals: SpawnVisuals,
		cooldown: SpawnConfig["cooldown"]
	) {
		super(visuals.title, { 
			category: 'spawner' 
		});

		this.client = client;
		this.spawn = visuals;
		this.config = { ...config, cooldown};
		this.answered = new Collection();
	}
}

// todo: cluster old spawner parts into emittable spawnHandler listeners
// export class Spawner implements Lava.Spawner {
// 	public queue: Collection<Snowflake, User>;
// 	public spawn: Lava.SpawnVisuals;
// 	public config: Lava.SpawnConfig;
// 	public answered: Collection<Snowflake, GuildMember>;
// 	public client: Lava.Client;
// 	public constructor(
// 		client: Lava.Client, 
// 		config: Lava.SpawnConfig,
// 		spawn: Lava.SpawnVisuals
// 	) {
// 		this.spawn = spawn;
// 		this.config = config;
// 		this.answered = new Collection();
// 		this.client = client;
// 	}

// 	public runCooldown(member: any): any {
// 		const { spawns } = this.client.config;
// 		const rateLimit: number = this.config.cooldown(member) || spawns.cooldown;
		
// 		return this.client.setTimeout((): boolean => {
// 			return this.client.queue.delete(member.user.id);
// 		}, rateLimit * 60 * 1000);
// 	}

// 	public async run({ channel, guild, member }: Message): Promise<MessageEmbed> {
// 		this.client.queue.set(member.user.id, channel);
// 		const event: Message = await this.spawnMessage(channel);
// 		const results: MessageEmbed = await this.collectMessages(event, channel, guild);
// 		this.runCooldown(member);
// 		return results;
// 	}

// 	public async spawnMessage(channel: any): Promise<Message> {
// 		const { emoji, type, title, description } = this.spawn;
// 		const event: Message = await channel.send(`**${emoji} \`${type} EVENT WOO HOO!\`**\n**${title}**\n${description}`);
// 		return event;
// 	}

// 	public async collectMessages(event: Message, channel: any, guild: Guild): Promise<any> {
// 		return new Promise(async resolve => {
// 			// Destruct
// 			const { entries, timeout, rewards } = this.config;
// 			const { strings, emoji, title } = this.spawn;
// 			const string: string = this.client.util.randomInArray(strings);

// 			// Collectors
// 			await channel.send(`Type \`${string.split('').join('\u200B')}\``);
// 			const filter: CollectorFilter = (m: Message): boolean => {
// 				let contentMatch = m.content.toLocaleLowerCase() === string.toLocaleLowerCase();
// 				return contentMatch && !this.answered.has(m.author.id);
// 			};
// 			const collector: MessageCollector = event.channel.createMessageCollector(filter, {
// 				max: entries, time: timeout
// 			});

// 			// Handle Collect
// 			collector.on('collect', async (msg: Message) => {
// 				this.answered.set(msg.author.id, msg.member);
// 				if (collector.collected.first().id === msg.id) {
// 					await msg.react('<:memerGold:753138901169995797>');
// 				} else {
// 					await msg.react(emoji);
// 				}
// 			});

// 			// Handle End
// 			collector.on('end', async (collected: Collection<Snowflake, Message>) => {
// 				await event.edit(`${event.content}\n\n**<:memerRed:729863510716317776> \`This event has expired.\`**`).catch(() => {});
// 				if (!collected.size) return resolve({ 
// 					color: 'RED', 
// 					description: '**<:memerRed:729863510716317776> No one got the event.**' 
// 				});

// 				// Vars
// 				const { min, max } = rewards;
// 				const results: string[] = [];
// 				this.answered.clear();

// 				// Loop through stuff
// 				const promises: any[] = collected.array().map(async (m: Message, i: number) => {
// 					// Stuff
// 					let coins: number;
// 					if (Math.random() > 0.95 && i === 0) {
// 						coins = this.config.rewards.first;
// 					} else {
// 						coins = this.client.util.randomNumber(min / 1000, max / 1000) * 1000;
// 					}

// 					const verbs: string[] = ['obtained', 'grabbed', 'magiked', 'won', 'procured'];
// 					const verb: string = this.client.util.randomInArray(verbs);
// 					// Visual stuff
// 					results.push(`\`${m.author.username}\` ${verb} **${coins.toLocaleString()}** coins`);
// 					const content: string = [
// 						`**${emoji} Congratulations!**`,
// 						`You ${verb} **${coins.toLocaleString()}** coins from the "${title}" event.`,
// 						`**${coins.toLocaleString()}** coins has been added to your unpaid credits (use our \`lava unpaids\` command).`
// 					].join('\n');

// 					// Update DB Stuff
// 					await this.client.db.spawns.addUnpaid(m.member.user.id, coins);
// 					await this.client.db.spawns.incrementJoinedEvents(m.member.user.id, 1);
// 					return m.author.send(content).catch(() => {});
// 				});

// 				// Promise Stuff
// 				await Promise.all(promises);
// 				const payouts: any = guild.channels.cache.get('796688961899855893') || collector.channel;
// 				await payouts.send({ embed: {
// 					author: { name: `Results for '${title}' event` },
// 					description: results.join('\n'),
// 					color: 'RANDOM',
// 					footer: { text: `From: ${channel.name}` }
// 				}}).catch(() => {});

// 				// Resolve the resulting embed
// 				return resolve({
// 					author: { name: `Results for '${title}' event` },
// 					description: results.join('\n'),
// 					color: 'GOLD',
// 					footer: { text: `Check your direct messages.` }
// 				});
// 			});
// 		});
// 	}
// }