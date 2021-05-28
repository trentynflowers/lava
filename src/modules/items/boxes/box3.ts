import { Box } from 'lib/objects';

export default class God extends Box {
	constructor() {
		super('box3', {
			name: 'God Box', tier: 2, cost: 250, info: {
				short: 'Tier 2 box filled with EPIC treats!',
				long: 'Includes medium-tier to god-tier items with some premium keys!'
			}, contents: { keys: 10, coins: [5e5, 5e6], tiers: [2, 3] }
		});
	}
}