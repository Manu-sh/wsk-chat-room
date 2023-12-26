'use strict';
import {ChannelManager} from '../channel/ChannelManager.js'
import {uniqueNamesGenerator, adjectives, animals} from 'unique-names-generator';

const generateUsername = () => uniqueNamesGenerator({  // big-donkey
    dictionaries: [adjectives, animals],
    separator: '-',
    length: 2
});


const Sym = {
    data: Symbol('data')
}

export const data = (client) => {
    return client[Sym.data];
};

export const mix = (client, instance) => {
    client[Sym.data] = instance;
    Object.defineProperty(client, Sym.data, {writable: false});
};


// comunque poi tutto il resto andrà tolto perché i dati verranno o da una mappa dei client online globale o da redis
// quindi l'username sarà acceduto così users[client.id].user oppure redis.get(client.id).user
export class ChatUser {

    static REGEXP = /^(\/?\?)/;

    ID;
    channel_name;
    username;

    constructor(id, channel_name) {
        Object.defineProperty(this, 'ID', {
            value: id,
            writable: false,
        });

        this.#setChannelName(channel_name);
        this.username = generateUsername();
    }

    #setChannelName(channel_name) {
        const res = new URLSearchParams(channel_name.replace(ChatUser.REGEXP, ''));
        this.channel_name = res.get('channel') ?? ChannelManager.DEFAUL_CHANNEL_NAME;
    }


}
