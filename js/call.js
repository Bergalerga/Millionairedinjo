

var question = new Audio('sounds/call_question.wav');
var calling = new Audio('sounds/call_calling.wav');
var finish = new Audio('sounds/telefonjoker_ende.mp3');
calling.loop = true;
calling.autoplay = true;

var countdown;
var running = false;

$(document).ready(function() {
    countdown = $("#countdown").countdown360({
        radius      : 300,
        seconds     : 30,
        fontColor   : '#FFFFFF',
        strokeStyle : '#FF9933',
        fillStyle   : '#006699',
        autostart   : false,
        label       : false,
        onComplete  : function () { console.log('done') }
    });

    $(document).keypress(function (e) {
        if (e.keyCode == 32) {
            if (!running) {
                calling.pause();
                question.play();
                countdown.start();
                running = true;
            } else {
                question.pause();
                finish.play();
                countdown.stop();
            }
        }
    });
});

