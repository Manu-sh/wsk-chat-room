'use strict';
import moment from 'moment';
import {Chat} from './src/chat/Chat.js';
import {data} from './src/user/ChatUser.js'



// TODO: Redis per la history dei messaggi nei vari canali?
// https://redis.io/docs/connect/clients/nodejs/

// TODO: channel chat per default deve interagire per canali quindi fare il broadcast a quelli nel canale
const wss = new Chat();

// request origin: https://github.com/theturtle32/WebSocket-Node/wiki/How-to%3A-List-all-connected-sessions-&-Communicating-with-a-specific-session-only

/*
setInterval(() => {
    console.log('client attivi' + wss.activeClients().length);
    console.log('canali attivi' + wss.channels.count_channels());
}, 3000)
*/

wss.on('chat:client:connected', (client) => {
    wss.channels.join(client);
});


wss.on('chat:authentication', (data, isBinary, client) => {
    // console.log(`authentication [${data(client).ID.red}]`);
});


wss.on('chat:cmd:msg', ({command, client}) => {
    wss.channels.sendToChannel(data(client).channel_name, `[${data(client).username}] ${moment().format('DD/MM/YYYY HH:mm:ss')} -> ${command.data.text}`);
});

wss.on('chat:cmd:chls', ({_, client}) => {
    wss.sendTo(data(client).ID, JSON.stringify([...wss.channels.keys()]));
});


// TODO: here
wss.on('chat:cmd:lchu', ({command, client}) => {
    const channel_name = command.data.channel;
    const channel = wss.channels.get(channel_name);
    if (!channel) return;
    //wss.sendTo(data(client).ID, JSON.stringify(channel.activeClients().map(client => data(client).ID)));
    wss.sendTo(data(client).ID, JSON.stringify(channel.activeClients().map(client => data(client).username)));
});

wss.on('chat:client:disconnect', (code, reason, client) => {
    wss.channels.quit(client);
});

wss.listen(3000);
