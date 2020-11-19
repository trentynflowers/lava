import { Client, Collection } from 'discord.js'
import { Player } from 'discord-music-player' // test
import DisTube from './Player.js'
import Utilities from './Utilities.js'

import { join } from 'path'
import { readdirSync } from 'fs'
import { log } from '../utils/logger.js'
import config from '../config.js'
import botPackage from '../../package.json'

export default class Musicord extends Client {
	constructor(discordOpts, playerOpts) {
		super(discordOpts);
		this.package = botPackage;
		this.config = config;
		this.utils = new Utilities();
		this.player = new DisTube(this, playerOpts);
		this.test = new Player(this);
		this.commands = new Collection();
		this.aliases = new Collection();
		this.cooldowns = new Collection();
		this._loadAll();
	}

	/** Load Everythin' */
	_loadAll() {
		try {
			this._loadListeners(this);
			log('main', 'Listeners Loaded')
			try {
				this._registerCommands();
				log('main', 'Commands Loaded')
			} catch(error) {
				log('error', 'Cannot register commands', error.stack)
			}
		} catch(error) {
			log('error', 'Cannot load bot listeners', error)
		}
	}

	/** Register Commands */
	_registerCommands() {
	readdirSync(join(__dirname, '..', 'commands'))
	.forEach(item => {
		// Item is a javascipt file
		if (item.endsWith('.js')) {
			const command = require(join(__dirname, '..', 'commands', item)).default;
			this.commands.set(command.name, command)
			if (command.aliases) command.aliases.forEach(alias => this.aliases.set(alias, command))
		}
		// item belongs to a category
		if (!item.endsWith('.js')) {
			readdirSync(join(__dirname, '..', 'commands', item))
			.forEach(cmd => {
				const command = require(join(__dirname, '..', 'commands', item, cmd)).default
				this.commands.set(command.name, command)
				if (command.aliases) command.aliases.forEach(alias => this.aliases.set(alias, command))
			})
		}
	})
	}

	/** Listeners */
	_loadListeners(bot) {
		readdirSync(join(__dirname, '..', 'listeners'))
		.forEach(async l => {
			await require(join(__dirname, '..', 'listeners', l)).run(bot);
		})
	}

	/** Functions */
	/** 
	 * Load Command
	 * @param {String} cmd - the cmd query to load
	 * @returns {Promise<Object>} the command object
	 */
	async reloadCommand(cmd) {
		return new Promise((res, rej) => {
			const command = this.commands.get(cmd) || this.aliases.get(cmd);
			if (!command) rej('UnknownCommand');
			// remove from both 'command' and 'aliases' collection
			this.commands.delete(command.name);
			command.aliases.forEach(a => this.aliases.delete(a));
			// and re-import it
			this.commands.set(command.name, command);
			command.aliases.forEach(a => this.aliases.set(a, command));
			res(command);
		})
	}

	/** 
	 * Load Command
	 * @returns {Promise<void>} null
	 */
	async reloadCommands() {
		return new Promise((res, rej) => {
			this.commands.clear();
			this.aliases.clear();
			if (this.commands || this.aliases) rej('Error');
			try { this._registerCommands() } catch { rej('ResgistrationError') }
			res();
		})
	}

	/** 
	 * Load Command
	 * @param {String} cmd - the cmd query to load
	 * @returns {Promise<String>} wip
	 */
	async unloadCommand(cmd) {
		return new Promise((res, rej) => {
			const command = this.commands.get(cmd) || this.aliases.get(cmd);
			if (!command) rej('UnknownCommand');
			// delete from collection
			this.commands.delete(command.name);
			command.aliases.forEach(a => this.aliases.delete(a, command));
			res('Done');
		})
	}

	/** 
	 * Load Command
	 * @param {String} cmd - the cmd query to load
	 * @returns {Promise<Object>} the command object
	 */
	async loadCommand(cmd) {
		return new Promise((res, rej) => {
			const array = [];
			readdirSync(join(__dirname, '..', 'commands'))
			.forEach(item => {
				if (item.endsWith('.js')) array.push(require(join(__dirname, '..', 'commands')).default);
				else readdirSync(join(__dirname, '..', 'commands', item)).forEach(c => array.push(require(join(__dirname, '..', 'commands', item, c)).default))
			})
			const command = array.find(c => c.name === cmd);
			if (command) res(command);
			else rej('unknownCommand');
		})
	}

	/** Getters */
	get version() {
		return this.package.version;
	}
	get dependencies() {
		return Object.keys(this.package.dependencies);
	}
	get prefix () {
		return this.config.prefix;
	}
}