import { Quest } from 'lib/handlers/quest';

export default class Extreme extends Quest {
	constructor() {
    	super('wake', {
      		rewards: { coins: 10e6, item: [200, 'coffee'] },
      		target: [1e3, 'slots', 'wins'],
      		diff: 'Extreme',
      		info: 'Win 1,000 games on slots.',
      		name: 'Wake It',
   		});
	}
}
