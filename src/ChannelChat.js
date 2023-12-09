'use strict';
import {BasicChat} from './BasicChat.js'
import {ChannelManager} from './channel/ChannelManager.js'

export class ChannelChat extends BasicChat {

    channels = new ChannelManager();

    constructor(...args) {
        super(...args);

        this.on('chat:client:connected', (...args) => {
            this.once('chat:message:received', (...args) => {
                this.emit('chat:authentication', ...args);
            });
        });

    }

}
