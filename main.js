'use strict';
import moment from 'moment';
import {BasicChat} from './src/BasicChat.js'

const wss = new BasicChat();

//wss.onHttpsUpgrade(() => 1);

wss.on('chat:message:received', (data, isBinary, client) => {
    console.log(data.toString(), isBinary)
    wss.sendAll(`[${client.id}] ${moment().format('DD/MM/YYYY HH:mm:ss')} -> ${data}`, { binary: isBinary });
})

wss.on('chat:client:disconnect', (code, reason, client) => {
    wss.sendAll(`[${client.id}] ${moment().format('DD/MM/YYYY HH:mm:ss')} left the chat`);
})

wss.https_server.listen(3000);
