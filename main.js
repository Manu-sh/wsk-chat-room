'use strict';
import moment from 'moment';
import {BasicChat} from './src/BasicChat.js'

const wss = new BasicChat();

//wss.onHttpsUpgrade(() => 1);

wss.on('chat:client:connected', (client, req) => {
    wss.sendAll(`[${client.id}] ${moment().format('DD/MM/YYYY HH:mm:ss')} join the chat`);
})

wss.on('chat:message:received', (data, isBinary, client) => {
    console.log(wss.activeClients().length)
    console.log('received: %s...', data.toString().substring(0, 10), isBinary)
    wss.sendAll(`[${client.id}] ${moment().format('DD/MM/YYYY HH:mm:ss')} -> ${data}`, { binary: isBinary });
})

wss.on('chat:client:disconnect', (code, reason, client) => {
    wss.sendAll(`[${client.id}] ${moment().format('DD/MM/YYYY HH:mm:ss')} left the chat`);
})

wss.listen(3000);
