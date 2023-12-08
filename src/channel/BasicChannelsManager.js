'use strict';


/*

    ch1 -> xx
           yy
           zz

    ch2 -> xx
           nn
           kk

    {
        'clients' => [xx, yy, zz, nn, kk]

        // TODO: weak-reference to clients?
        'ch1' => [xx, yy, zz],
        'ch2' => [xx, nn, kk],
    }
*/

import {BasicChannel} from './BasicChannel.js'

export class BasicChannelsManager {

    // Map<String,BasicChannel>
    channels = {};

    joinToChannel(ch_name, client) { // : BasicChannel
        const channel = this.channels[ch_name] ??= new BasicChannel(ch_name);
        channel.join(client);
        return channel;
    }

    quitFromChannel(ch_name, client) { // : bool
        const channel = this.channels[ch_name];
        if (!channel) return false;

        channel.quit(client);
        if (channel.empty()) delete this.channels[ch_name];
        return true;
    }

    sendToChannel(ch_name, ...args) { // : void
        this.channels[ch_name]?.sendAll(...args);
    }

}
