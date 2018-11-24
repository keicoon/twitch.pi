var head = document.getElementsByTagName('head')[0];
var script = document.createElement('script');
script.type = 'text/javascript';
script.onload = function () {

    let info = document.getElementById("info");
    info.textContent = "Enter a word in the chat."
    let info_key = document.getElementById("info_key");
    info_key.textContent = action_keys.join(' / ')

    regist_time();
    let update_chat = reigst_chat();

    const channel = 'keicoon15';

    // In this example, TwitchJS is included via a <script /> tag, so we can access
    // the library from window.
    const TwitchJS = window.TwitchJS;

    // Define client options.
    var options = {
        options: {
            // Debugging information will be outputted to the console.
            debug: true
        },
        connection: {
            reconnect: true,
            secure: true
        },
        // If you want to connect as a certain user, provide an identity here:

        channels: [`#${channel}`]
    };

    const client = new TwitchJS.client(options);

    // Add listeners for events, e.g. a chat event.
    client.on('chat', (channel, userstate, message, self) => {
        // You can do something with the chat message here ...
        // console.info({ channel, userstate, message, self });
        if (is_valid_event(message)) {
            update_chat(`<${userstate["display-name"]}> : ${message}`);
            twich_event(message);
        }
    });

    // Finally, connect to the Twitch channel.
    client.connect();
}
script.src = 'https://unpkg.com/twitch-js@1.2.5/dist/twitch-js.min.js';
head.appendChild(script);

function regist_time() {
    let time = document.getElementById("time");
    let seconds = 0, minutes = 0, hours = 0;
    setInterval(() => {
        seconds++;
        if (seconds >= 60) {
            seconds = 0;
            minutes++;
            if (minutes >= 60) {
                minutes = 0;
                hours++;
            }
        }

        time.textContent = `UPTIME : ${(hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds)}`;
    }, 1000);
}

function reigst_chat() {
    const MAXIMUM_LEGNTH = 14;
    let texts = [];
    let chat = document.getElementById("chat");
    function update_chat(text) {
        texts.push(text);
        if (texts.length > MAXIMUM_LEGNTH) {
            texts.shift();
        }

        chat.innerText = texts.join('\n');
    }
    return update_chat;
}