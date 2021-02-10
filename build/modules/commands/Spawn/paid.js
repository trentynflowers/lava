"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_akairo_1 = require("discord-akairo");
const discord_js_1 = require("discord.js");
class Spawn extends discord_akairo_1.Command {
    constructor() {
        super('paid', {
            aliases: ['paid'],
            description: 'Updates someone elses or your lava unpaid amounts',
            category: 'Spawn',
            userPermissions: ['MANAGE_MESSAGES'],
            args: [{
                    id: 'amount',
                    type: 'number',
                    unordered: true
                }, {
                    id: 'user',
                    type: 'member',
                    unordered: true,
                    default: (message) => message.member
                }]
        });
    }
    async deleteMessage(m) {
        return m.delete({ timeout: 3000 });
    }
    async exec(_, args) {
        const { amount, user } = args;
        // Args
        if (!amount)
            return _.reply('You need an amount.').then(this.deleteMessage);
        else if (!user)
            return _.reply('You need a user.').then(this.deleteMessage);
        // Update
        const data = await this.client.db.spawns.removeUnpaid(user.user.id, amount);
        // Message
        const embed = new discord_js_1.MessageEmbed()
            .setAuthor(`Updated: ${user.user.tag}`, user.user.avatarUrl({ dynamic: true }))
            .setFooter(this.client.user.username, this.client.user.avatarURL())
            .addField('Total Unpaids Left', data.unpaid.toLocaleString())
            .setTimestamp(Date.now()).setColor('ORANGE');
        return _.channel.send({ embed });
    }
}
exports.default = Spawn;
