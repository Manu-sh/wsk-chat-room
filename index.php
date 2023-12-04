    <html>
      <head>
        <script type="text/javascript">
          const ws = new WebSocket('wss://localhost:3000');

          // Browser WebSockets have slightly different syntax than `ws`.
          // Instead of EventEmitter syntax `on('open')`, you assign a callback
          // to the `onopen` property.
          ws.onopen = function() {

            const btn = document.getElementById('#send');
            btn.disabled = false;

            btn.addEventListener('click', () => {
                const msg_node = document.getElementById('#message');
                ws.send(msg_node.value);
                msg_node.value = '';
            });

            document.querySelector('#message').addEventListener('keydown', function (kev) {
                if (kev.key !== 'Enter') return;

                kev.preventDefault();
                document.querySelector('#send').dispatchEvent(new Event('click'));
            });
          };

          ws.onmessage = function(msg) {
            document.querySelector('#messages').innerHTML += `<div>${msg.data}</div>`;
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