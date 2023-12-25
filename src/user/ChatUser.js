'use strict';
import {ChannelManager} from '../channel/ChannelManager.js'
import {uniqueNamesGenerator, adjectives, animals} from 'unique-names-generator';

const generateUsername = () => uniqueNamesGenerator({  // big-donkey
    dictionaries: [adjectives, animals],
    separator: '-',
    length: 2
});

const ChatUserSymbol = {
    setChannelName: Symbol('#setChannelName')
}

export class ChatUser {

    static REGEXP = /^(\/?\?)/;

    ID;
    channel_name;
    chat_user = {
        name: null
    };

    constructor(id, channel_name) {
        Object.defineProperty(this, 'ID', {
            value: id,
            writable: false,
        });

        this[ChatUserSymbol.setChannelName](channel_name);
        this.chat_user.name = generateUsername();
    }

    [ChatUserSymbol.setChannelName](channel_name) {
        const res = new URLSearchParams(channel_name.replace(ChatUser.REGEXP, ''));
        this.channel_name = res.get('channel') ?? ChannelManager.DEFAUL_CHANNEL_NAME;
    }


}
