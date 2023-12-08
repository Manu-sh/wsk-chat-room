'use strict';
import {BasicChat} from '../BasicChat.js'
import {SimpleChannelsManager} from './ManageChannels.js'

export class ChannelChat extends BasicChat {

    channels = new SimpleChannelsManager;

    constructor(...args) {
        super(...args);
    }

}
