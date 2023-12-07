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

export class ManageChannels {

    channels = {};

    constructor() {}

    joinToChannel(ch_name, client) {
        const channel = this.channels[ch_name] ??= new BasicChannel(ch_name);
        channel.join(client);
        return channel;
    }

    quitFromChannel(ch_name, client) {
        this.channels[ch_name]?.quit(client);
    }

    sendToChannel(ch_name, ...args) {
        this.channels[ch_name]?.sendAll(...args);
    }

}
