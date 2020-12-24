const { Listener } = require('discord-akairo');

/**
 * Discord Ready event
 * @exports @class @extends Listener
*/
module.exports = class DiscordListener extends Listener {
	constructor() {
		super('discord:ready', {
			emitter: 'client',
			event: 'ready'
		});
	}

	/**
	 * Executes this listener
	 * @method
	 * @returns {Promise<void>}
	*/
	async exec() {
		this.client.util.log(
			this.constructor.name, 'main',
			`${this.client.user.tag} is now logged onto Discord.`
		);

		await this.client.channels.cache
		.get('789692296094285825')
		.send({ embed: {
			title: 'Ready',
			color: 'ORANGE',
			description: [
				`**${this.client.user.tag}** logged in.`,
				`Usage: \`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}mb\` in \`${process.platform}\``
			].join('\n'),
			thumbnail: { url: this.client.user.avatarURL() },
			timestamp: Date.now(),
			footer: {
				text: this.client.user.username,
				iconURL: this.client.user.avatarURL()
			}
		}});

	}
}