'use strict';
import {WebSocketServer} from 'ws';
import {createServer} from 'https';
import {readFileSync} from 'fs';
import env from './env.js';

/*
function make_static_https(unset = false) {

    if (unset === true) {
        make_static_https.https_server.close();
        delete make_static_https.https_server;
    }

    // memoization
    return make_static_https.https_server ??= createServer({
        minVersion: 'TLSv1',
        key:  readFileSync(env('WSS_KEY_PEM_PATH')),
        cert: readFileSync(env('WSS_CRT_PEM_PATH')),
        ca: 'X509 CERTIFICATE',
    });
}
*/

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
        // this.on('connection', (...args) => this.#setupPurger(...args));
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


    // https://www.npmjs.com/package/ws#how-to-detect-and-close-broken-connections
    /*
    #purger_interval = null;
    #setupPurger(sk, req) {

        sk.isAlive = true;
        sk.on('error', console.error);
        sk.on('pong', () => sk.isAlive = true);

        this.#purger_interval = setInterval(() => {
            this.clients.forEach(client => {

                if (client.isAlive === false) {
                    console.log(`force kill ${client.id}`)
                    return client.close();
                }

                client.isAlive = false;
                client.ping();
            });
        }, 1000);

        this.on('close', () => {
            clearInterval(this.#purger_interval);
            this.#purger_interval = null;
        });
    }
    */




}
