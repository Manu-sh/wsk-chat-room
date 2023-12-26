'use strict';

import {WebSocketServer} from 'ws';
import {createServer} from 'https';
import {readFileSync} from 'fs';
import env from '../env.js';


export class WSS extends WebSocketServer {

    #https_server;

    constructor(ws_arg) {
        super(Object.assign({}, {noServer: true, backlog: 100}, ws_arg));
        this.#https_server ??= createServer({
            minVersion: 'TLSv1',
            key:  readFileSync(env('WSS_KEY_PEM_PATH')),
            cert: readFileSync(env('WSS_CRT_PEM_PATH')),
            ca: 'X509 CERTIFICATE',
        });

        this.on('close', () => this.#https_server.close());
    }

    get getHttpsServer() { return this.#https_server; }

    listen(...args) {
        this.#https_server.listen(...args);
    }

    onHttpsUpgrade(callback_predicate) {

        // https://nodejs.org/docs/latest-v18.x/api/tls.html#class-tlstlssocket
        this.#https_server.on('upgrade', (request, socket, head) => {

            const result = callback_predicate();

            if (!result) {
                socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
                socket.destroySoon();
                return;
            }

            super.handleUpgrade(request, socket, head, ws => {
                this.emit('connection', ws, request);
            });

        });
    }

}
