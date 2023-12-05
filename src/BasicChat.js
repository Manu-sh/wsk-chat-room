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

            //console.log('client online [%d]', Object.keys(self.wss_clients).length);

            sk.on('message', (...args) => {

                console.log(sk.id);
                // console.log('received: %s...', data.toString().substring(0, 10));
                //console.log('client online [%d]', Object.keys(self.wss_clients).length);

                this.emit('chat:message:received', ...[...args, sk]);
                //this.sendAll(`${moment().format('DD/MM/YYYY HH:mm:ss')} -> ${data}`, { binary: isBinary });
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

    onMessage(callback) {

    }

}
