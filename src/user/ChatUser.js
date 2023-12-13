'use strict';

import {ChannelManager} from '../channel/ChannelManager.js'

export class ChatUser {

    static regexp = /^(\/?\?)/;

    id;
    channel_name;

    constructor(id, channel_name) {
        this.id = id;
        this.#setChannelName(channel_name);
    }

    #setChannelName(channel_name) {
        const res = new URLSearchParams(channel_name.replace(ChatUser.regexp, ''));
        this.channel_name = res.get('channel') ?? ChannelManager.DEFAUL_CHANNEL_NAME;
    }


}
