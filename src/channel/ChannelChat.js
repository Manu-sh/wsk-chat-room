'use strict';
import {BasicChat} from '../BasicChat.js'
import {ManageChannels} from './ManageChannels.js'

export class ChannelChat extends BasicChat {

    channels = new ManageChannels;

    constructor(...args) {
        super(...args);
    }

}
