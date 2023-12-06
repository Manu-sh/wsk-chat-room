import {WSS} from './WSS.js'
import WebSocket from 'ws'

export class BasicChat extends WSS {

    wss_clients = {};

    constructor(arg, onHttpsUpgrade = () => true) {

        super(arg);

        this.onHttpsUpgrade(onHttpsUpgrade);

        const self = this;
        this.on('connection', (sk,req) => {

            sk.id = req.headers['sec-websocket-key'];
            this.wss_clients[ sk.id ] = req;

            sk.on('message', (...args) => {
                console.log(sk.id);
                this.emit('chat:message:received', ...[...args, sk]);
            });

            sk.on('close', (...args) => {
                delete this.wss_clients[sk.id];
                this.emit('chat:client:disconnect', ...[...args, sk])
            });

        });
    }

    sendAll(...args) {
        this.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN)
                client.send(...args);
        });
    }

    onAuthentication(callback) {

    }

    activeClients() {
        return [...this.clients[Symbol.iterator]()]
            .reduce((carry,client) => carry + (client.readyState === WebSocket.OPEN), 0);
    }

}
