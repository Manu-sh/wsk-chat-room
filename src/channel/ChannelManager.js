'use strict';

import {Channel} from './Channel.js';
import {data} from '../chat/common/wss-property-proxy.js';


export class ChannelManager {

    static DEFAUL_CHANNEL_NAME = 'general';

    // Map<String,Channel>
    channels = {
        'general': new Channel(ChannelManager.DEFAUL_CHANNEL_NAME)
    };

    constructor() {}

    get(channel_name) {
        const ch = this.channels[channel_name];
        return ch ?? null;
    }

    join(client) { // : Channel
        const channel = this.channels[data(client).channel_name] ??= new Channel(data(client).channel_name);
        channel.join(client);
        return channel;
    }

    quit(client) { // : bool
        const channel = this.channels[data(client).channel_name];
        if (!channel) return false;

        channel.quit(client);
        if (channel.empty() && channel.name !== ChannelManager.DEFAUL_CHANNEL_NAME)
            delete this.channels[data(client).channel_name];

        return true;
    }

    change(client, ch_name) { // : void

        if (data(client).channel_name === ch_name)
            return;

        this.quit(client);
        data(client).channel_name = ch_name;
        this.join(client);
    }


    sendToChannel(ch_name, ...args) { // : void
        this.channels[ch_name]?.sendAll(...args);
    }

    count(ch_name) {
        return ch_name ?
            this.channels[ch_name]?.count() || 0
                : Object.keys(this.channels).length;
    }


    *keys() { // : Iterator<String>
        yield *Object.keys(this.channels);
    }

}
