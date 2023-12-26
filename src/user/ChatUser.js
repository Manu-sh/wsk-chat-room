'use strict';
import {ChannelManager} from '../channel/ChannelManager.js';
import {generateUsername} from './utility.js';

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
