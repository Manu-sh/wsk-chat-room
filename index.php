    <html>
      <head>
        <script type="text/javascript">
          const ws = new WebSocket('wss://localhost:3000/' + location.search);

          // Browser WebSockets have slightly different syntax than `ws`.
          // Instead of EventEmitter syntax `on('open')`, you assign a callback
          // to the `onopen` property.
          ws.onopen = function() {

              // mock authentication
            ws.send(JSON.stringify({
                data: {
                    cmd: 'login',
                    user: '',
                    passwd: ''
                }
            }));

            const btn = document.getElementById('send');
            btn.disabled = false;

            btn.addEventListener('click', () => {

                const msg_node = document.getElementById('message');

                if ((msg_node.value ?? '') === '')
                    return;

                const cmd = {
                    auth_token: '',
                    data: {
                        cmd: 'msg',
                        text: msg_node.value
                    }
                };

                ws.send(JSON.stringify(cmd));
                msg_node.value = '';
            });

            document.getElementById('message').addEventListener('keydown', function (kev) {
                if (kev.key !== 'Enter') return;

                kev.preventDefault();
                document.getElementById('send').dispatchEvent(new Event('click'));
            });
          };

          ws.onmessage = function(msg) {
            document.getElementById('messages').innerHTML += `<div>${msg.data}</div>`;
          };
        </script>
      </head>
      <body>
        <h1>Chat</h1>
        <div>
          <input id="message" placeholder="Message">
          <button id="send" disabled="true">Send</button>
        </div>
        <div id="messages">
        </div>
      </body>
    </html>
