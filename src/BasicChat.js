import {WSS} from './WSS.js'
import WebSocket from 'ws'
import moment from 'moment'


export class BasicChat extends WSS {

    wss_clients = {};

    constructor(arg, onHttpsUpgrade = () => true) {

        super(arg);

        this.onHttpsUpgrade(onHttpsUpgrade);

        const self = this;
        this.on('connection', (sk,req) => {

            sk.id = req.headers['sec-websocket-key'];
            this.wss_clients[ sk.id ] = req;

            console.log('client online [%d]', Object.keys(self.wss_clients).length);

            sk.on('message', (data, isBinary) => {

                console.log('received: %s...', data.toString().substring(0, 10));
                console.log('client online [%d]', Object.keys(self.wss_clients).length);

                this.emit('chat:message', data, isBinary);

                self.clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN)
                        client.send(`${moment().format('DD/MM/YYYY HH:mm:ss')} -> ${data}`, { binary: isBinary });
                });

            });

        });
    }

    onAuthentication(callback) {

    }

    onMessage(callback) {

    }

}
