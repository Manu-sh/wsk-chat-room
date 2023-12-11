'use strict';
import {BasicChat} from './BasicChat.js'
import {ChannelManager} from './channel/ChannelManager.js'
import {parseCmd, validate} from './message/ajv-schemas.js'

export class ChannelChat extends BasicChat {

    channels = new ChannelManager();

    constructor(...args) {

        super(...args);
        super.on('chat:message:received', (data, isBinary, client) => {

            const command = parseCmd(data);
            if (!command.valid) {
                console.error(validate.cmd.msg.errors);
                return;
            }

            const payload = {
                command, client, data, isBinary,
            };

            switch (command.data.cmd) {
                case 'quit':
                    this.emit('cmd:disconnect', payload);
                    return;
                case 'msg':
                    this.emit('cmd:msg', payload)
                    return;
                case 'join':
                    this.emit('cmd:join', payload)
                    return;
            }

        });

    }

}
