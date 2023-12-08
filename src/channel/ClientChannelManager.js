'use strict';
import {BasicChannelsManager} from './BasicChannelsManager.js'

export class ClientChannelManager {

    channels = new BasicChannelsManager();

    join(client) { // : void
        this.channels.joinToChannel(client.channel_name, client);
    }

    quit(client) { // : bool
        return this.channels.quitFromChannel(client.channel_name, client);
    }

    change(client, channel_name) { // : void

        if (client.channel_name === channel_name)
            return;

        this.quit(client);
        client.channel_name = channel_name;
        this.join(client);
    }

    sendToChannel(channel_name, ...args) {
        this.channels.sendToChannel(channel_name, ...args)
    }

    count_channels() {
        return this.channels.count_channels();
    }

}
