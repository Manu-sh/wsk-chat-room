'use strict';
import {Channel} from './Channel.js'

/*
    // TODO: weak-reference to clients?
    {
        'clients' => [xx, yy, zz, nn, kk]
        'ch1' => [xx, yy, zz],
        'ch2' => [xx, nn, kk],
    }
*/


export class ChannelManager {

    // Map<String,BasicChannel>
    channels = {};

    join(client) { // : BasicChannel
        const channel = this.channels[client.channel_name] ??= new Channel(client.channel_name);
        channel.join(client);
        return channel;
    }

    quit(client) { // : bool
        const channel = this.channels[client.channel_name];
        if (!channel) return false;

        channel.quit(client);
        if (channel.empty()) delete this.channels[client.channel_name];
        return true;
    }

    change(client, ch_name) { // : void

        if (client.channel_name === ch_name)
            return;

        this.quit(client);
        client.channel_name = ch_name;
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


    *it() { // : Iterator<Pair<String,WebSocket>>
        for (const channel_name of Object.keys(this.channels))
            yield channel_name;
    }

}
