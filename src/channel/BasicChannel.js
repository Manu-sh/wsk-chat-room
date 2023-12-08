'use strict';


/*

    ch1 -> xx
           yy
           zz

    ch2 -> xx
           nn
           kk

    {
        'clients' => [xx, yy, zz, nn, kk]

        // TODO: weak-reference to clients?
        'ch1' => [xx, yy, zz],
        'ch2' => [xx, nn, kk],
    }
*/

import moment from 'moment'
import WebSocket from 'ws';

export class BasicChannel {

    name = '';
    clients = new Map(); // Map<String,WebSocket>

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

    members_len() { // : number
        return this.clients.size;
    }

    empty() { // : bool
        return !this.members_len();
    }

    *generator() { // : Iterator<Pair<String,WebSocket>>
        return this.clients.entries();
    }

    activeClients() {
        return [...this.clients.values()]
            .filter(client => client.readyState === WebSocket.OPEN);
    }

    sendAll(...args) {
        this.activeClients().forEach(client => {
            client.send(...args);
        });
    }

}
