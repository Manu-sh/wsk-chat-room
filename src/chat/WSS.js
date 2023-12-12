'use strict';
import {WebSocketServer} from 'ws';
import {createServer} from 'https';
import {readFileSync} from 'fs';
import env from '../env.js';

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


}
