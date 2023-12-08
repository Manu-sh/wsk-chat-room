'use strict';
import {BasicChat} from '../BasicChat.js'
import {BasicChannelsManager} from './BasicChannelsManager.js'

export class ChannelChat extends BasicChat {

    channels = new BasicChannelsManager;

    constructor(...args) {
        super(...args);
    }

}
