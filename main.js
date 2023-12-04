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

const ws = new WebSocketServer({
    server,
    backlog: 100
});

ws.on('connection', sk => {

    sk.on('error', console.error);

    sk.on('message', function message(data) {
        console.log('received: %s', data);
        sk.send(`${moment().format('DD/MM/YYYY HH:mm:ss')} -> ${data}`);
    });

    setInterval(() => sk.send(`${moment().format('DD/MM/YYYY HH:mm:ss')} -> PONG`), 10e3)
});

server.listen(3000);
