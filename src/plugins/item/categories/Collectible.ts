import { Context, Item, ItemOptions } from 'lava/index';
import { MessageOptions } from 'discord.js';

export interface CollectibleItemOptions extends Pick<ItemOptions, 'name' | 'price' | 'emoji' | 'shortInfo' | 'longInfo' | 'upgrades'> {
	/**
	 * The entities aka "perks" of this collectible.
	 */
	entities?: Entity;
}

/**
 * The perks aka "entities" for this collectible.
 */
export interface Entity {
	/**
	 * The additional dice roll on gambling.
	 */
	dice?: ArrayUnion<number>;
	/**
	 * The discount debuffed if they buy an item.
	 */
	discount?: ArrayUnion<number>;
	/**
	 * The possible rewarded multis if they own one of this.
	 */
	multipliers?: ArrayUnion<number>;
	/**
	 * The possible steal shields if they own this collectible.
	 */
	shield?: ArrayUnion<number>;
	/**
	 * The possible slot odd to hit a jackpot.
	 */
	slots?: ArrayUnion<number>;
	/**
	 * The rate between 1-500% of payouts on commands that gives you coins.
	 */
	payouts?: ArrayUnion<number>;
	/**
	 * The possible xp boost between 50-1000% 
	 */
	xpBoost?: ArrayUnion<number>;
	/**
	 * Increase odds of successful rob.
	 */
	rob?: ArrayUnion<number>;
}

export abstract class CollectibleItem extends Item {
	/**
	 * Possible perks if they own this collectible.
	 */
	public entities: Entity;

	/**
	 * Constructor for this goldshit.
	 */
	public constructor(id: string, options: CollectibleItemOptions) {
		super(id, {
			name: options.name,
			price: options.price,
			emoji: options.emoji,
			shortInfo: options.shortInfo,
			longInfo: options.longInfo,
			upgrades: options.upgrades,
			sale: true,
			inventory: true,
			shop: true,
			buyable: true,
			giftable: true,
			sellable: false,
			usable: true,
			push: true,
			premium: false,
			retired: false,
			category: 'Collectible'
		});

		this.entities = options.entities;
	}

	/**
	 * Method to use this collectible.
	 */
	public async use(ctx: Context): Promise<MessageOptions> {
		const thisItem = await ctx.currency.fetch(ctx.author.id).then(d => d.items.get(this.id));
		return { reply: { messageReference: ctx.id }, content: `**${this.emoji} WHAT A FLEX!**\nImagine having **${thisItem.owned.toLocaleString()}**, couldn't be me` };
	}
}