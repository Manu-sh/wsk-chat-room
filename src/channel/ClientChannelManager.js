
import {BasicChannelsManager} from './BasicChannelsManager.js'

export class ClientChannelManager {

    channels = new BasicChannelsManager();

    join(client) {
        this.channels.joinToChannel(client.channel_name, client);
    }

    quit(client) {
        return this.channels.quitFromChannel(client.channel_name, client);
    }

    change(client, channel_name) {

        if (client.channel_name === channel_name)
            return;

        this.quit(client);
        client.channel_name = channel_name;
        this.join(client);
    }


}
