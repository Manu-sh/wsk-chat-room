'use strict';
import {BasicChat} from '../BasicChat.js'
import {ClientChannelManager} from './ClientChannelManager.js'

export class ChannelChat extends BasicChat {

    channels = new ClientChannelManager();

    constructor(...args) {
        super(...args);
    }

}
