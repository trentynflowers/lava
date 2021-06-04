/**
 * Base class for all items.
 * @author BrianWasTaken
 */

import { AbstractModuleOptions, AbstractModule } from '..';
import { MessageOptions } from 'discord.js';
import { ItemHandler } from '.';
import { Context } from '../..'; 

export interface ItemDescription {
	/**
	 * The description to display in the shop menu.
	 */
	short?: string;
	/**
	 * The description to display when viewing this item.
	 */
	long?: string;
}

export interface ItemUpgrade {
	/**
	 * The new emoji for this item.
	 */
	emoji?: string;
	/**
	 * The level of this item.
	 */
	level?: number;
	/**
	 * The new price of this item.
	 */
	price: number;
	/**
	 * The new name for this item.
	 */
	name?: string;
}

export interface ItemInfo {
	/**
	 * The cost of this item for level 0
	 */
	buy: number;
	/**
	 * The sell rate from 0.01 to 1 for level 0.
	 */
	sell: number;
	/**
	 * The emoji for this item for level 0.
	 */
	emoji: string;
	/**
	 * The name for this item for level 0.
	 */
	name: string;
}

export interface ItemConfig {
	/**
	 * Wether to show this item in user inventory.
	 */
	showInInventory?: boolean;
	/**
	 * Wether to show this item on the shop.
	 */
	showInShop?: boolean;
	/**
	 * Wether this item is sellble or not.
	 */
	sellable?: boolean;
	/**
	 * Wether this item is buyable from the shop or not.
	 */
	buyable?: boolean;
	/**
	 * Wether this item has been retired.
	 * config properties overriden by this option:
	 * * showInInventory = false
	 * * showInShop = false
	 * * buyable = false
	 * * usable = false
	 */
	retired?: boolean;
	/**
	 * Wether this item should be bought with keys or not.
	 */
	premium?: boolean;
	/**
	 * Wether this item is usable.
	 */
	usable?: boolean;
}

export interface ItemOptions extends AbstractModuleOptions {
	/**
	 * The description of this item.
	 */
	description: ItemDescription;
	/**
	 * The upgrades for this item.
	 */
	upgrades: ItemUpgrade[];
	/**
	 * The shop config for this item.
	 */
	config: ItemConfig;
	/**
	 * The basic info about this item.
	 */
	info: ItemInfo;
}

export abstract class Item extends AbstractModule {
	/**
	 * The shop config for this item.
	 */
	public config: ItemConfig;
	/**
	 * The description for this item.
	 */
	public description: ItemDescription;
	/**
	 * The handler this item beholds.
	 */
	public handler: ItemHandler;
	/**
	 * The shop info of this item.
	 */
	public info: ItemInfo;
	/**
	 * The upgrades of this item.
	 */
	public upgrades: ItemUpgrade[];
	/**
	 * The constructor for any item.
	 */
	public constructor(id: string, options: Partial<ItemOptions>) {
		super(id, { name: options.info.name, category: options.category });
		/**
		 * Description for this item.
		*/
		this.description = this._assign(options.description, {
			short: 'An unknown item.',
			long: 'No description.',
		});

		/**
		 * Configuration of this item.
		*/
		this.config = this._assign(options.config, {
			showInInventory: false,
			showInShop: false,
			sellable: false,
			buyable: false,
			retired: false,
			premium: false,
			usable: false
		});

		/**
		 * Check it's retirement.
		 */
		if ('retired' in options.config) {
			if (options.config.retired) {
				this.config = {
					...this.config,
					showInInventory: false,
					showInShop: false,
					buyable: false,
					usable: false
				};
			}
		}

		/**
		 * What you see most in the shop.
		*/
		this.info = this._assign(options.info, {
			emoji: ':thinking:',
			name: 'Unknown Item',
			sell: 0,
			buy: 1,
		});

		/**
		 * The upgrades for this item.
		*/
		this.upgrades = options.upgrades.map(
			(up: ItemUpgrade, i: number) => this._assign(up, {
				emoji: this.info.emoji,
				level: i + 1, // +1 because base item config is level 0
				name: this.name,
				price: this.info.buy,
			})
		);
	}

	/**
	 * Assign the default properties of constructed items to default ones.
	 * @private
	 * @returns {object} the object
	 */
	private _assign<A>(o1: PartialUnion<A>, o2: A): A {
		return Object.assign(o2, o1);
	}

	/**
	 * Main method to use items.
	*/
	public use(context: Context | Context<{ times: number }>): PromiseUnion<MessageOptions> {
		return { reply: { messageReference: context.id, failIfNotExists: false }, embed: {
			description: 'Bob is currently building this item shush-',
			title: `${this.info.emoji} ${this.name}`, color: 0xfafafa,
		}};
	}
}