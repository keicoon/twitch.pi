let script = document.createElement('script');
script.type = 'text/javascript';
script.src = 'https://unpkg.com/twitch-js@1.2.5/dist/twitch-js.min.js';
script.onload = function () {

    function register_IO() {
        let ACTION2TEXT_MAP = {};
        let wrap_keyevent = { "keyCode": 0, "preventDefault": () => { } };
        let is_key_down = false;

        function mapping(key_sets) {
            const code = key_sets.shift();
            for (const key of key_sets) {
                ACTION2TEXT_MAP[key] = code;
            }
        }
        mapping([37, 'LEFT', 'Left', 'left', 'L', 'l']);
        mapping([38, 'UP', 'Up', 'up', 'U', 'u']);
        mapping([39, 'RIGHT', 'Right', 'right', 'R', 'r']);
        mapping([40, 'DOWN', 'Down', 'down', 'D', 'd']);
        mapping([88, 'A', 'a', 'Z', 'z']);
        mapping([90, 'B', 'b', 'X', 'x']);

        function is_valid_event(text) {
            return ACTION2TEXT_MAP[text];
        }

        function twich_event(text) {
            if (is_key_down) return;
            is_key_down = true;

            const key = ACTION2TEXT_MAP[text];
            wrap_keyevent.keyCode = key;
            keyDown(wrap_keyevent);
            setTimeout(() => {
                keyUp(wrap_keyevent);
                is_key_down = false;
            }, 280);
        }

        return { is_valid_event, twich_event }
    }
    function register_info() {
        let info = document.getElementById("info_title");
        info.textContent = "Enter a below word in the chat room."
        let info_key = document.getElementById("info_keys");
        info_key.textContent = `[ left / up / right / down / a / b ]`;
    };

    function register_time() {
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
    };

    function reigster_chat() {
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
            texts.push(`[${usename}]이 ${CODE2TEXT_MAP[ACTION2TEXT_MAP[text]]}`);
            if (texts.length > MAXIMUM_LEGNTH) {
                texts.shift();
            }
            chat.innerText = texts.join('\n');
        }

        return update_chat;
    }

    const { is_valid_event, twich_event } = register_IO();
    register_info();
    register_time();
    const update_chat = reigster_chat();

    const channel = 'keicoon15';
    // In this example, TwitchJS is included via a <script /> tag, so we can access
    // the library from window.
    const TwitchJS = window.TwitchJS;
    // Define client options.
    var options = {
        options: {
            // Debugging information will be outputted to the console.
            // debug: true
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
let head = document.getElementsByTagName('head')[0];
head.appendChild(script);