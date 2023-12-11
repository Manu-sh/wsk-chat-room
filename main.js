'use strict';
import moment from 'moment';
import {ChannelChat} from './src/ChannelChat.js';

import jwt from 'jsonwebtoken';
import env from './src/env.js'

import {validate, parseCmd} from './src/message/ajv-schemas.js';

import colors from 'colors';
colors.enable();


// TODO: Redis per la history dei messaggi?
// TODO: Redis per la gestione dei canali?
// https://redis.io/docs/connect/clients/nodejs/

// TODO: channel chat per default deve interagire per canali quindi fare il broadcast a quelli nel canale
/// TODO: prima ancora chat deve decodificare il messaggio
// bindare l'evento reiceved, quello authenticated etc.
const wss = new ChannelChat({
    //path: '/ch1'
});

// request origin: https://github.com/theturtle32/WebSocket-Node/wiki/How-to%3A-List-all-connected-sessions-&-Communicating-with-a-specific-session-only

/*
setInterval(() => {
    console.log('client attivi' + wss.activeClients().length);
    console.log('canali attivi' + wss.channels.count_channels());
}, 3000)
*/

// TODO: here
const payload = {
    'test': 'ciao'
};

const options = {
    expiresIn: '10s'
};

const token = jwt.sign(payload, env('JWT_KEY'), options);
console.log(token);
// process.exit();

wss.on('chat:client:connected', (client, req) => {
    wss.channels.join(client);
});

wss.on('chat:authentication', (data, isBinary, client) => {
    //console.log(JSON.parse(data))
    console.log(`authentication [${client.id.red}]`);
});


wss.on('cmd:msg', ({command, client, isBinary}) => {

    wss.channels.sendToChannel(
        client.channel_name,
        `[${client.id}] ${moment().format('DD/MM/YYYY HH:mm:ss')} -> ${command.data.text}`,
        { binary: isBinary }
    );
})

/*
wss.on('chat:message:received', (data, isBinary, client) => {




    const command = parseCmd(data);
    if (!command.valid) {
        console.error(validate.cmd.msg.errors);
        return;
    }

    const type = command.data.cmd;

    switch (type) {
        case 'quit':
            wss.emit('chat:client:disconnect', 0, 0, client);
            return;
        case 'msg':
            wss.channels.sendToChannel(
                client.channel_name,
                `[${client.id}] ${moment().format('DD/MM/YYYY HH:mm:ss')} -> ${command.data.text}`,
                { binary: isBinary }
            );
            return;
        case 'join':
            wss.channels.change(client, command.data.channel);
            return;
    }

});
 */


// TODO: possibilità di cambiar canale senza disconnettere l'utente
wss.on('chat:client:disconnect', (code, reason, client) => {
    wss.channels.quit(client);
});

wss.listen(3000);
