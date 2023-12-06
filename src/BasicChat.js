'use strict';
import {WSS} from './WSS.js'
import WebSocket from 'ws'

export class BasicChat extends WSS {

    wss_clients = {};
    #purge_interval = null;

    constructor(arg, onHttpsUpgrade = () => true) {

        super(arg);

        this.onHttpsUpgrade(onHttpsUpgrade);

        const self = this;
        this.on('connection', (sk,req) => {

            sk.id = req.headers['sec-websocket-key'];
            this.wss_clients[ sk.id ] = {
                sk: sk,
                conn_req: req
            };

            this.#setupPurger(sk);

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

    // https://www.npmjs.com/package/ws#how-to-detect-and-close-broken-connections
    #setupPurger(sk) {

        this.#purge_interval = setInterval(() => {
            this.clients.forEach(client => {

                if (client.isAlive === false) {
                    delete this.wss_clients[client.id];
                    return client.terminate();
                }

                client.isAlive = false;
                client.ping();
            });
        }, 30_000);

        sk.isAlive = true;
        sk.on('error', console.error);
        sk.on('pong', () => sk.isAlive = true);
        this.on('close', (...args) => {
            clearInterval(this.#purge_interval);
            this.emit('chat:wss:close', ...args);
        });
    }


    listen(...args) {
        this.https_server.listen(...args);
    }


    onAuthentication(callback) {}

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
