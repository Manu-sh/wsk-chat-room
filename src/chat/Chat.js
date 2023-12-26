'use strict';
import {BasicChat} from './BasicChat.js';
import {ChannelManager} from '../channel/ChannelManager.js';
import {validate, parseCmd} from '../command/ajv-payload-cmd-validation.js';

export class Chat extends BasicChat {

    channels = new ChannelManager();

    constructor(...args) {

        super(...args);
        super.on('chat:message:received', (data, isBinary, client) => {

            const command = parseCmd(data);
            if (!command.valid) {
                console.error(validate.cmd.msg.errors);
                return;
            }

            const payload = { command, client, data, isBinary };
            switch (command.data.cmd) {
                case 'quit':
                    this.emit('chat:cmd:quit', payload);
                    return;
                case 'msg':
                    this.emit('chat:cmd:msg', payload);
                    return;
                case 'join':
                    this.emit('chat:cmd:join', payload);
                    return;
                case 'chls':
                    this.emit('chat:cmd:chls', payload);
                    return;
                case 'lchu':
                    this.emit('chat:cmd:lchu', payload);
                    return;
            }

        });

    }

}
