'use strict';
import moment from 'moment';
import {ChannelChat} from './src/ChannelChat.js';

// TODO: Redis per la history dei messaggi?
// TODO: Redis per la gestione dei canali?

// TODO: channel chat per default deve interagire per canali quindi fare il broadcast a quelli nel canale
// bindare l'evento reiceved, quello authenticated etc.
const wss = new ChannelChat({
    //path: '/ch1'
});

/*
setInterval(() => {
    console.log('client attivi' + wss.activeClients().length);
    console.log('canali attivi' + wss.channels.count_channels());
}, 3000)
*/


wss.on('chat:client:connected', (client, req) => {
    wss.channels.join(client);
});


// TODO: gestisce l'autenticazione di un utente una sola volta dopo la connessione
wss.on('chat:client:connected', (client, req) => {

    wss.once('chat:message:received', (data, isBinary, client) => {
        //console.log(JSON.parse(data))
    });

});

wss.on('chat:message:received', (data, isBinary, client) => {

    console.log('received: %s...', data.toString().substring(0, 10), isBinary)

    wss.channels.sendToChannel(
        client.channel_name,
        `[${client.id}] ${moment().format('DD/MM/YYYY HH:mm:ss')} -> ${data}`,
        { binary: isBinary }
    );
});


// TODO: possibilità di cambiar canale senza disconnettere l'utente
wss.on('chat:client:disconnect', (code, reason, client) => {
    wss.channels.quit(client);
});

wss.listen(3000);
