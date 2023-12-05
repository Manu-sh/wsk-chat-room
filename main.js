'use strict';
import moment from 'moment';
import WebSocket from 'ws';
import {BasicChat} from './src/BasicChat.js'

const wss = new BasicChat();

//wss.onHttpsUpgrade(() => 1);

wss.on('chat:message', (a,b) => {
    console.log(a,b)
})

wss.https_server.listen(3000);
