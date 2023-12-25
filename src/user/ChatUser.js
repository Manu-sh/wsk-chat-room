'use strict';
import {ChannelManager} from '../channel/ChannelManager.js'
import {uniqueNamesGenerator, adjectives, animals} from 'unique-names-generator';

const generateUsername = () => uniqueNamesGenerator({  // big-donkey
    dictionaries: [adjectives, animals],
    separator: '-',
    length: 2
});

export class ChatUser {

    static regexp = /^(\/?\?)/;

    id;
    channel_name;
    user = { name: null };

    constructor(id, channel_name) {
        this.id = id;
        this.#setChannelName(channel_name);
        this.user.name = generateUsername();
    }

    #setChannelName(channel_name) {
        const res = new URLSearchParams(channel_name.replace(ChatUser.regexp, ''));
        this.channel_name = res.get('channel') ?? ChannelManager.DEFAUL_CHANNEL_NAME;
    }


}
