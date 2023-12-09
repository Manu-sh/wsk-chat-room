# websk-echo-minimal
WSS echo server - without authentication

https://stackoverflow.com/questions/20088/is-there-a-way-to-make-firefox-ignore-invalid-ssl-certificates

```shell
npm run app
php -S localhost:8000
```

* https://stackoverflow.com/questions/12871565/how-to-create-pem-files-for-https-web-server#12907165
* https://nodejs.org/docs/latest-v18.x/api/tls.html#tlscreatesecurecontextoptions
* https://nodejs.org/docs/latest-v18.x/api/tls.html#tlsconnectoptions-callback
* https://www.geeksforgeeks.org/how-to-create-https-server-with-node-js/

Se la chiave è generata con questo comando `openssl req -new -x509 -keyout key.pem -out crt.pem`
la chiave privata è cifrata e serve passare il parametro `passphrase` specificando la password fornita.

```js
const server =  createServer({
    minVersion: 'TLSv1',
    key:  readFileSync('./key.pem', 'utf8'),
    cert: readFileSync('./crt.pem', 'utf8'),
    ca: 'X509 CERTIFICATE',
    passphrase: 'hello'
});
```
aggiungendo l'opzione -nodes in fondo non è più necessario 
(`openssl req -new -x509 -keyout key.pem -out crt.pem -nodes`)


---

join 2 channel
- automatic chanel change

```json
  {
    "cmd": "join",
    "channel": "ch1"
  }
```

quit from current channel
```json
  {
    "cmd": "quit"
  }
```

broadcast message to current channel
```json
  {
    "cmd": "msg",
    "text": "testo del messaggio" 
  }
```
