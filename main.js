'use strict';
import moment from 'moment';
import {WSS} from './src/WSS.js';
import WebSocket from 'ws';

const wss = new WSS();

wss.onHttpsUpgrade(() => 1);


wss.on('connection', (sk,req) => {

    /*
    wss.clients.forEach((ws) => {
        //ws.id = req.headers['sec-websocket-key'];
        console.log(ws.origin);
    });
   */


    sk.id = req.headers['sec-websocket-key'];
    console.log(sk.id);
    //console.log(atob(sk.id)) ;
    console.log(req.headers) ;

    sk.on('message', function message(data, isBinary) {
        console.log('received: %s', data);
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN)
                client.send(`${moment().format('DD/MM/YYYY HH:mm:ss')} -> ${data}`, { binary: isBinary });
        });

    });

});

wss.https_server.listen(3000);
