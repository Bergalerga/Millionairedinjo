var Millionare  = (function($) {

    var questions = []
    var nextQuestion = 0
    var lastCorrectAnswer = -1

    var getQuestion = function(id) {
        return questions[id]
    }

    var resetQuestionStyle = function() {
        $('#alternatives').children().css('background-color', '#223e95');
    }

    return {
        init: function(url) {
            console.log('Initiating Millionare.js')
            $.ajax({
                url: url,
                dataType: 'json',
                success: function(result) {
                    questions = result;
                    console.log('Successfully loaded questions')
                },
                error: function(err) {
                    console.error(err)
                }
            });
        },
        populateNextQuestion: function() {
            question = getQuestion(nextQuestion)
            lastCorrectAnswer = question.correct
            nextQuestion++
            $('#question h1').html(question.question)
            $(question.alternatives).each(function(index, alternative) {
                console.log(0)
                id = '#alternative-' + (index + 1)
                $(id).html(alternative);
            });
        },
        lastCorrectAnswer: function() {
            return lastCorrectAnswer
        },
        reset: resetQuestionStyle
    }

})(jQuery);

var showNextQuestion = true;

//audio
var duringCallSound = new Audio('sounds/call_question.wav');
var beforeCallSound = new Audio('sounds/call_calling.wav');
var finishedCallSound = new Audio('sounds/telefonjoker_ende.mp3');
var standardSound = new Audio('sounds/stufe_3.mp3');
beforeCallSound.loop = true;
standardSound.loop = true;
standardSound.autoplay = true;


//call
var countdown;
var running = false;
var calling = false;


$(document).ready(function() {
    Millionare.init('questions/questions.json')

    $(document).keypress(function(e) {
        var lastCorrectAnswer = Millionare.lastCorrectAnswer()
        var question;
        if (e.keyCode == 13) {
            if (showNextQuestion) {
                Millionare.reset()
                Millionare.populateNextQuestion()
            } else {
                question = $('#question-' + lastCorrectAnswer).css('background-color', 'green')
            }
            showNextQuestion = !showNextQuestion
        }
        else if (e.keyCode == 65 || e.keyCode == 97) {
            question = $('#question-1');
            (lastCorrectAnswer == 1) ? $(question).css('background-color', 'green') : $(question).css('background-color', 'red')
        }
        else if (e.keyCode == 66 || e.keyCode == 98) {
            question = $('#question-2');
            (lastCorrectAnswer == 2) ? $(question).css('background-color', 'green') : $(question).css('background-color', 'red')
        }
        else if (e.keyCode == 67  || e.keyCode == 99) {
            question = $('#question-3');
            (lastCorrectAnswer == 3) ? $(question).css('background-color', 'green') : $(question).css('background-color', 'red')
        }
        else if (e.keyCode == 68 || e.keyCode == 100) {
            question = $('#question-4');
            (lastCorrectAnswer == 4) ? $(question).css('background-color', 'green') : $(question).css('background-color', 'red')
        }
        //Keyboard button 5
        else if (e.keyCode == 53) {
            var answs = [1,2,3,4]
            console.log(answs.indexOf(lastCorrectAnswer))
            answs.splice(answs.indexOf(lastCorrectAnswer), 1)
            answs.splice(answs[Math.floor(Math.random()*answs.length)], 1)
            q1 = $("#alternative-" + answs[0].toString()).html("");
            q2 = $("#alternative-" + answs[1].toString()).html("");
        }
        //spacebar
        else if (e.keyCode == 32) {
            if(calling) {
                if (!running) {
                    beforeCallSound.pause();
                    duringCallSound.play();
                    countdown.start();
                    running = true;
                } else {
                    duringCallSound.pause();
                    finishedCallSound.play();
                    countdown.stop();
                    fadeOutClock();
                    calling = false;
                    running = false;
                }
            }
        }
        else {
            Millionare.reset();
        }
    });


    $("#help-call").on("click", function () {

        $(document.body).append('<div id="call"></div>');

        var call = $("#call");

        countdown = call.countdown360({
            radius      : call.width(),
            seconds     : 30,
            fontColor   : '#FFFFFF',
            strokeStyle : '#FF9933',
            fillStyle   : '#006699',
            autostart   : false,
            label       : false,
            onComplete  : function () {
                fadeOutClock();
                calling = false;
                running = false;
            }
        });

        duringCallSound = new Audio('sounds/call_question.wav');
        beforeCallSound.play();
        standardSound.pause();
        calling = true;

        fadeInClock();
    });
});

var fadeInClock = function () {
    var pos = -140;
    var clock = $('#call');
    clock.css('right', pos);
    var interval = setInterval(function () {
        pos+=5;
        clock.css('right', pos);
        if(pos >= 210) {
            clearInterval(interval);
        }
    },1)
};
var fadeOutClock = function () {
    var pos = 210;
    var clock = $('#call');
    clock.css('right', pos);
    var interval = setInterval(function () {
        pos-=5;
        clock.css('right', pos);
        if(pos <= -140) {
            clearInterval(interval);
            standardSound.play();
            clock.remove();
        }
    },1)
};
