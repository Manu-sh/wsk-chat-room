'use strict';
import {ChannelManager} from '../channel/ChannelManager.js'
import {uniqueNamesGenerator, adjectives, animals} from 'unique-names-generator';

const generateUsername = () => uniqueNamesGenerator({  // big-donkey
    dictionaries: [adjectives, animals],
    separator: '-',
    length: 2
});

const Sym = {
    setChannelName: Symbol('#setChannelName'),
    username:       Symbol('username'),
}

export class ChatUser {

    static REGEXP = /^(\/?\?)/;

    ID;
    channel_name;

    // comunque poi tutto il resto andrà tolto perché i dati verranno o da una mappa dei client online globale o da redis
    // quindi l'username sarà acceduto così users[client.id].user oppure redis.get(client.id).user
    [Sym.username];

    constructor(id, channel_name) {
        Object.defineProperty(this, 'ID', {
            value: id,
            writable: false,
        });

        this[Sym.setChannelName](channel_name);
        this[Sym.username] = generateUsername();
    }

    [Sym.setChannelName](channel_name) {
        const res = new URLSearchParams(channel_name.replace(ChatUser.REGEXP, ''));
        this.channel_name = res.get('channel') ?? ChannelManager.DEFAUL_CHANNEL_NAME;
    }


}
