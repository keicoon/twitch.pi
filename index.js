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

const ACTIONS = {
    "LEFT": 37,
    "RIGHT": 39,
    "UP": 38,
    "DOWN": 40,
    "A": 88,
    "B": 90
};
const action_keys = Object.keys(ACTIONS);
function is_valid_event(text) {
    return action_keys.find(key => key == text);
}
let wrap_keyevent = {
    "keyCode": 0,
    "preventDefault": () => { }
};
function twich_event(text) {
    const key = ACTIONS[text];
    wrap_keyevent.keyCode = key;
    keyDown(wrap_keyevent);
    setTimeout(() => keyUp(wrap_keyevent), 300);
}