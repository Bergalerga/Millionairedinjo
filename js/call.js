

var question = new Audio('sounds/call_question.wav');
var calling = new Audio('sounds/call_calling.wav');
calling.loop = true;
calling.autoplay = true;


$(document).ready(function() {
    $(document).keypress(function (e) {
        if (e.keyCode == 32) {
            calling.pause();
            question.play();
        }
    });
});