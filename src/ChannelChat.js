'use strict';
import {BasicChat} from './BasicChat.js'
import {ChannelManager} from './channel/ChannelManager.js'

export class ChannelChat extends BasicChat {

    channels = new ChannelManager();

    constructor(...args) {
        super(...args);
    }

}
