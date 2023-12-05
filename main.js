'use strict';
import moment from 'moment';
import {WSS} from './src/WSS.js';

const wss = new WSS();

wss.onHttpsUpgrade(() => 1);


wss.on('connection', (sk) => {
/*
    wss.clients.forEach(function each(client) {
        console.log(client.getTra);
    });*/

    sk.on('error', console.error);

    sk.on('message', function message(data) {
        console.log('received: %s', data);
        sk.send(`${moment().format('DD/MM/YYYY HH:mm:ss')} -> ${data}`);
    });

});

wss.https_server.listen(3000);
