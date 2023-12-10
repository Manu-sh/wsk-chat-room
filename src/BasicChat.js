'use strict';
import {WSS} from './WSS.js';
import WebSocket from 'ws';

import {ChatUser} from './user/ChatUser.js';

export class BasicChat extends WSS {

    wss_clients = {};

    constructor(arg, onHttpsUpgrade = () => true) {

        super(arg);
        super.onHttpsUpgrade(onHttpsUpgrade);

        // https://nodejs.org/docs/latest-v18.x/api/http.html#class-httpincomingmessage
        this.on('connection', (sk,req) => {

            // mixing https://www.w3docs.com/learn-javascript/mixins.html
            Object.assign(sk, new ChatUser(req.headers['sec-websocket-key'], req.url));

            this.wss_clients[ sk.id ] = {
                sk: sk,
                conn_req: req
            };

            // bind authentication event
            this.on('chat:client:connected', (...args) => {
                this.once('chat:message:received', (...args) => {
                    this.emit('chat:authentication', ...args);
                });
            });

            this.emit('chat:client:connected', sk, req);

            sk.on('message', (...args) => {
                this.emit('chat:message:received', ...[...args, sk]);
            });

            sk.on('close', (...args) => {
                delete this.wss_clients[sk.id];
                this.emit('chat:client:disconnect', ...[...args, sk])
            });

        });

    }

    activeClients() {
        return [...this.clients[Symbol.iterator]()]
            .filter(client => client.readyState === WebSocket.OPEN);
    }

    sendTo(client_id, ...args) {
        const client = this.wss_clients[client_id]?.sk;
        client.send(...args);
    }

    sendAll(...args) {
        this.activeClients().forEach(client => {
            client.send(...args);
        });
    }

}
