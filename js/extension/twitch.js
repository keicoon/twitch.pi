var head = document.getElementsByTagName('head')[0];
var script = document.createElement('script');
script.type = 'text/javascript';
script.onload = function () {
    function regist_info() {
        let info = document.getElementById("info_title");
        info.textContent = "Enter a below word in the chat room."
        let info_key = document.getElementById("info_keys");
        info_key.textContent = `[ left / up / right / down / a / b ]`;
    }

    function regist_time() {
        let time = document.getElementById("info_time");
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
        const CODE2TEXT_MAP = {
            37: "< Left > 를 입력.",
            38: "< Up > 를 입력.",
            39: "< Right > 를 입력.",
            40: "< Down > 를 입력.",
            88: "< A Key > 를 입력.",
            90: "< B Key > 를 입력."
        };
        const MAXIMUM_LEGNTH = 15;
        let texts = [];
        let chat = document.getElementById("info_chat");
        function update_chat(usename, text) {
            texts.push(`[${usename}] : ${CODE2TEXT_MAP[ACTION2TEXT_MAP[text]]}`);
            if (texts.length > MAXIMUM_LEGNTH) {
                texts.shift();
            }

            chat.innerText = texts.join('\n');
        }

        return update_chat;
    }

    regist_info();
    regist_time();
    const update_chat = reigst_chat();

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
        if (!GameBoyEmulatorInitialized()) return;
        // You can do something with the chat message here ...
        // console.info({ channel, userstate, message, self });
        if (is_valid_event(message)) {
            update_chat(userstate["display-name"], message);
            twich_event(message);
        }
    });
    // Finally, connect to the Twitch channel.
    client.connect();
}
script.src = 'https://unpkg.com/twitch-js@1.2.5/dist/twitch-js.min.js';
head.appendChild(script);