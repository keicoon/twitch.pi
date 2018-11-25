let DEBUG_WINDOWING = false;
let DEBUG_MESSAGES = false;

window.onload = function () {
    register();

    var file = document.getElementById('getfile');
    file.onchange = function () {
        var fileList = file.files;
        // 읽기
        var reader = new FileReader();
        reader.readAsBinaryString(fileList[0]);
        //로드 한 후
        reader.onload = function () {
            console.log('starting to load rom');
            start(mainCanvas, reader.result);
            console.log('regist options');
            register_options();
        };
    };
}

function register() {
    const SCALE = 3.0;
    mainCanvas = document.getElementById("mainCanvas");
    mainCanvas.width *= SCALE;
    mainCanvas.height *= SCALE;

    registerIO();
}

function register_options() {
    const speed = 1.5;
    gameboy.setSpeed(Math.max(parseFloat(speed), 0.001))
}
// @advanced
post_process = () => {
    add_canvas_filter();
}
function add_canvas_filter() {
    var canvasData = gameboy.canvasBuffer.data;
    let len = canvasData.length, i = 0, luma;
    // convert by iterating over each pixel each representing RGBA
    for (; i < len; i += 4) {
        // calculate luma, here using Rec 709
        luma = canvasData[i] * 0.2126 + canvasData[i + 1] * 0.7152 + canvasData[i + 2] * 0.0722;
        // update target's RGB using the same luma value for all channels
        canvasData[i] = canvasData[i + 1] = canvasData[i + 2] = luma;
        canvasData[i + 3] = canvasData[i + 3];                            // copy alpha
    }
    gameboy.graphicsBlit();
}

function registerIO() {
    document.addEventListener("keydown", keyDown, false);
    document.addEventListener("keyup", function (event) {
        if (event.keyCode == 27) {
            //Fullscreen on/off
            // fullscreenPlayer();
        }
        else {
            //Control keys / other
            keyUp(event);
        }
    }, false);
}

let ACTION2TEXT_MAP = {};
{
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
}
function is_valid_event(text) {
    return ACTION2TEXT_MAP[text];
}
let wrap_keyevent = {
    "keyCode": 0,
    "preventDefault": () => { }
};
let is_key_down = false;
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