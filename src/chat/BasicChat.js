'use strict';
import {WSS} from './WSS.js';
import WebSocket from 'ws';

import {ChatUser} from '../user/ChatUser.js';
import {data, mix} from './common/wss-property-proxy.js';

export class BasicChat extends WSS {

    wss_clients = {}; // faster client search

    constructor(arg, onHttpsUpgrade = () => true) {

        super(arg);
        super.onHttpsUpgrade(onHttpsUpgrade);


        // https://nodejs.org/docs/latest-v18.x/api/http.html#class-httpincomingmessage
        this.on('connection', (client, req) => {

            // mixing https://www.w3docs.com/learn-javascript/mixins.html
            mix(client, new ChatUser(req.headers['sec-websocket-key'], req.url))
            this.wss_clients[ data(client).ID ] = {
                client,
                conn_req: req
            };

            this.emit('chat:client:connected', client, req);

            // bind authentication event
            client.once('message', (...args) => {

                // fire the authentication event
                this.emit('chat:authentication', ...[...args, client]);

                // ignore the first message event which contain the authentication message
                client.on('message', (...args) => {
                    this.emit('chat:message:received', ...[...args, client]);
                });
            });

            client.on('close', (...args) => {
                delete this.wss_clients[data(client).ID];
                this.emit('chat:client:disconnect', ...[...args, client])
            });

        });

    }

    activeClients() {
        return [...this.clients[Symbol.iterator]()]
            .filter(client => client.readyState === WebSocket.OPEN);
    }

    sendTo(client_id, ...args) {
        const client = this.wss_clients[client_id]?.client;
        client.send(...args);
    }

    sendAll(...args) {
        this.activeClients().forEach(client => {
            client.send(...args);
        });
    }

}
