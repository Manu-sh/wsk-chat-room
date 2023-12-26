# websk-echo-minimal
WSS echo server - without authentication

future events(?)
| Event                    | Alternate Name                    | Description                              |
|--------------------------|-----------------------------------|------------------------------------------|
| chat:channel:joined      | ~~chat:channel:join:after~~        | After the user has joined the channel   |
| chat:channel:quitting    | ~~chat:channel:quit:before~~       | Before the user leaves the channel      |
| chat:channel:created     | ~~chat:channel:created:after~~     | After the channel is created            |
| chat:channel:closing     | ~~chat:channel:close:before~~      | Before the channel is destroyed         |



https://stackoverflow.com/questions/20088/is-there-a-way-to-make-firefox-ignore-invalid-ssl-certificates

```shell
npm run app
php -S localhost:8000
```

Open the browser and join to a channel (aka. chat-room).
the default channel is general `http://localhost:8000/?channel=ch1`
not all commands are implemented by the client side, actually there is no
login because it's uncompleted.

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

```json
{
    "data": {
      "cmd": "login",
      "user": "user",
      "passwd": "1"
    }
}
```

join 2 channel
- automatic chanel change

```json
{
  "auth_token": "xxx",
  "data": {
     "cmd": "join",
     "channel": "ch1"
  }
}
```

quit from current channel
```json
{
  "auth_token": "xxx",
  "data": {
    "cmd": "quit"
  }
}
```

broadcast message to current channel
```json
{
  "auth_token": "xxx",
  "data": {
    "cmd": "msg",
    "text": "testo del messaggio"
  }
}
```

---
list channels

```json
{
  "auth_token": "xxx",
  "data": {
     "cmd": "chls"
  }
}
```

list channel users

```json
{
  "auth_token": "xxx",
  "data": {
     "cmd": "lchu",
     "channel": "ch1"
  }
}
```
