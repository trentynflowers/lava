import { CurrencyEntry } from '.';
import { Endpoint } from '..';

export class CurrencyEndpoint extends Endpoint<CurrencyData> {
	public async fetch(_id: string) {
		return this.model.findOne({ _id }).then(doc => {
			return doc ?? new this.model({ _id }).save();
		}).then(doc => new CurrencyEntry(this.client, doc));
	}
}