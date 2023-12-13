'use strict';

// 'ch1' => [xx, yy, zz]

import moment from 'moment'
import WebSocket from 'ws';

export class Channel {

    name = '';
    clients = new Map(); // Map<String,ChatUser>

    constructor(name) {
        this.name = name;
    }

    join(client) { // : void
        this.clients.set(client.id, client);
        this.sendAll(`[${client.id}] ${moment().format('DD/MM/YYYY HH:mm:ss')} join the channel ${this.name}`);
    }

    quit(client) { // : self
        this.sendAll(`[${client.id}] ${moment().format('DD/MM/YYYY HH:mm:ss')} left the chat`);
        this.clients.delete(client.id);
        return this;
    }

    count() { // : number
        return this.clients.size;
    }

    empty() { // : bool
        return !this.count();
    }

    *#activeClients() { // : Iterator<Pair<String,ChatUser>>
        for (const client of this.clients.values())
            if (client.readyState === WebSocket.OPEN)
                yield client;
    }

    *keys() { // : Iterator<String>
        yield *this.clients.keys();
    }

    toArray() { // Array<ChatUser>
        return [...this.#activeClients()];
    }

    sendAll(...args) {
        this.toArray().forEach(client => {
            client.send(...args);
        });
    }

}
