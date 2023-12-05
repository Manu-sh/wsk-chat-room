'use strict';
import {WebSocketServer} from 'ws';
import {createServer} from 'https';
import {readFileSync} from 'fs';
import moment from 'moment';


// https://stackoverflow.com/questions/12871565/how-to-create-pem-files-for-https-web-server#12907165
// https://nodejs.org/docs/latest-v18.x/api/tls.html#tlscreatesecurecontextoptions
// https://nodejs.org/docs/latest-v18.x/api/tls.html#tlsconnectoptions-callback
// https://www.geeksforgeeks.org/how-to-create-https-server-with-node-js/

/*

Se la chiave è generata con questo comando `openssl req -new -x509 -keyout key.pem -out crt.pem`

la chiave privata è cifrata e serve passare il parametro passphrase
specificando la password fornita.

const server =  createServer({
    minVersion: 'TLSv1',
    key:  readFileSync('./key.pem', 'utf8'),
    cert: readFileSync('./crt.pem', 'utf8'),
    ca: 'X509 CERTIFICATE',
    passphrase: 'hello'
});

aggiungendo l'opzione -nodes in fondo non è più necessario
(openssl req -new -x509 -keyout key.pem -out crt.pem -nodes)
*/

// openssl req -new -x509 -keyout key.pem -out crt.pem -nodes
const server =  createServer({
    minVersion: 'TLSv1',
    key:  readFileSync('./key.pem', 'utf8'),
    cert: readFileSync('./crt.pem', 'utf8'),
    ca: 'X509 CERTIFICATE',
});

const wss = new WebSocketServer({
    //server,
    noServer: true,
    backlog: 100
});


wss.on('connection', sk => {

    sk.on('error', console.error);

    sk.on('message', function message(data) {
        console.log('[%s] received: %s', sk.id, data);
        sk.send(`[${sk.id}] ${moment().format('DD/MM/YYYY HH:mm:ss')} -> ${data}`);
    });

    //setInterval(() => sk.send(`[${sk.id}] ${moment().format('DD/MM/YYYY HH:mm:ss')} -> PONG`), 10e3)
});


// https://nodejs.org/docs/latest-v18.x/api/tls.html#class-tlstlssocket
server.on('upgrade', function upgrade(request, socket, head) {

    if (0) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroySoon();
        return;
    }

    wss.handleUpgrade(request, socket, head, function done(ws) {
        wss.emit('connection', ws, request);
    });

});



server.listen(3000);
