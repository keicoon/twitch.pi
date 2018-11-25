window.onload = function () {
    let file = document.getElementById('getfile');
    file.onchange = function () {
        let reader = new FileReader();
        reader.readAsBinaryString(file.files[0]);
        //로드 한 후
        reader.onload = function () {
            console.log('starting to load rom');
            pre_init();
            start(mainCanvas, reader.result);
            post_init();
        };
    };
}

function pre_init() {
    function init_IO() {
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

    const SCALE = 3.0;
    mainCanvas = document.getElementById("mainCanvas");
    mainCanvas.width *= SCALE;
    mainCanvas.height *= SCALE;

    init_IO();
}

function post_init() {
    // const SPEED = 1.5;
    // gameboy.setSpeed(Math.max(parseFloat(SPEED), 0.001))
}

// @INFO: Online-GameBoy API
post_process = () => {
    function set_canvas_filter() {
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

    set_canvas_filter();
}