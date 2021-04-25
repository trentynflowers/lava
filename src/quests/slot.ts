import { Quest } from 'lib/handlers/quest';

export default class Extreme extends Quest {
	constructor() {
	    super('slot', {
			rewards: { coins: 1e6, item: [10, 'donut'] },
			target: [2e3, 'slots', 'jackpots'],
			diff: 'Extreme',
			info: 'Win 2,000 jackpots on slot machine.',
			name: 'Slot It',
	    });
	}
}
