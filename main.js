'use strict';
import moment from 'moment';
import {ChannelChat} from './src/channel/ChannelChat.js'

// TODO: Redis per la history dei messaggi?
// TODO: Redis per la gestione dei canali?

const wss = new ChannelChat({
    //path: '/ch1'
});

setInterval(() => {
    console.log('client attivi' + wss.activeClients().length);
    console.log('canali attivi' + wss.channels.count_channels());
}, 3000)

wss.on('chat:client:connected', (client, req) => {
    wss.channels.join(client);
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
    //wss.channels.quitFromChannel(client.channel_name, client);
    //client.channel_name = '/';
    wss.channels.quit(client);
});

wss.listen(3000);
