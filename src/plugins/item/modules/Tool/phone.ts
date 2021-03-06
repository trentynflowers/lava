import { Context, CurrencyEntry } from 'lava/index';
import { ToolItem } from '../..';

export default class Tool extends ToolItem {
	constructor() {
		super('phone', {
			name: 'Smort Phone',
			emoji: ':mobile_phone:',
			price: 6000,
			shortInfo: 'High-tech phone for bastards!',
			longInfo: 'Contact anyone using your phone, anywhere!'
		});
	}

	async exec(ctx: Context, entry: CurrencyEntry) {
		
	}
}