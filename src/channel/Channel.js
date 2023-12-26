'use strict';

// 'ch1' => [xx, yy, zz]

import moment from 'moment'
import WebSocket from 'ws';
import {data} from '../user/ChatUser.js';

export class Channel {

    name = '';
    clients = new Map(); // Map<String,ChatUser>

    constructor(name) {
        this.name = name;
    }

    join(client) { // : void
        this.clients.set(data(client).ID, client);
        this.sendAll(`[${data(client).username}] ${moment().format('DD/MM/YYYY HH:mm:ss')} join the channel ${this.name}`);
    }

    quit(client) { // : self
        this.sendAll(`[${data(client).username}] ${moment().format('DD/MM/YYYY HH:mm:ss')} left the chat`);
        this.clients.delete(data(client).ID);
        return this;
    }

    count() { // : number
        return this.clients.size;
    }

    empty() { // : bool
        return !this.count();
    }

    activeClients() { // Array<ChatUser>
        return [...this.clients.values()]
            .filter(client => client.readyState === WebSocket.OPEN);
    }

    sendAll(...args) {
        this.activeClients().forEach(client => {
            client.send(...args);
        });
    }

}
