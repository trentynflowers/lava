import { AbstractModuleOptions, AbstractModule } from '..';
import { MessageOptions } from 'discord.js';
import { ItemHandler } from '.';
import { Context } from '../..'; 

export interface ItemDescription {
	short: string;
	long: string;
}

export interface ItemUpgrade {
	price: number;
	emoji: string;
	level: number;
	name: string;
}

export interface ItemInfo {
	emoji: string;
	sell: number;
	buy: number;
}

export interface ItemConfig {
	showInInventory: boolean;
	showInShop: boolean;
	sellable: boolean;
	buyable: boolean;
	retired: boolean;
	premium: boolean;
	usable: boolean;
}

export interface ItemOptions extends AbstractModuleOptions {
	description: ItemDescription;
	upgrades: ItemUpgrade[];
	config: ItemConfig;
	info: ItemInfo;
}

export class Item extends AbstractModule {
	public description: ItemDescription;
	public handler: ItemHandler;
	public config: ItemConfig;
	public info: ItemInfo;
	public constructor(id: string, options: ItemOptions) {
		super(id, options);
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
			showInInventory: true,
			showInShop: true,
			sellable: true,
			buyable: true,
			retired: false,
			premium: false,
			usable: true,
		});

		/**
		 * What you see most in the shop.
		*/
		this.info = this._assign(options.info, {
			emoji: ':thinking:',
			sell: 0.5,
			buy: 100,
		});
	}

	private _assign<A, B>(o1: B, o2: A): A {
		return Object.assign(o2, o1);
	}

	public use(context: Context, times: number): PromiseUnion<MessageOptions>;
	public use(context: Context, times: number): PromiseUnion<MessageOptions> {
		return { reply: { messageReference: context.id, failIfNotExists: false }, embed: {
			description: 'This item perhaps, is in a work in progress :)',
			title: 'WIP Item', color: 0xfafafa,
		}};
	}
}