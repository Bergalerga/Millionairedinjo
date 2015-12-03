var Millionare  = (function($) {

    var questions = [];
    var nextQuestion = 0;
    var lastCorrectAnswer = -1;
    // 50/50 Specific
    var reducedAlternatives = false;
    // Audience Specific
    var askedAudience = false;
    // Call Specific
    var hasCalled = false;
    var countdown;
    var running = false;
    var calling = false;

    var sounds = {
        /* Chrome supports .wav and loop, but Safari doesn't */
        'duringCallSound': new Audio('sounds/call_question.wav'),
        'beforeCallSound': new Audio('sounds/call_calling.wav'),
        'finishedCallSound': new Audio('sounds/telefonjoker_ende.mp3'),
        'standardSound': new Audio('sounds/stufe_3.mp3'),
        'fiftyFiftySound': new Audio('sounds/50_50.mp3')
    };

    var bindListeners = function() {
        $("#help-call").on("click", function () {
            if (hasCalled) return;
            $(this).css('opacity', '0.3');

            $(document.body).append('<div id="call"></div>');

            var call = $("#call");
            countdown = call.countdown360({
                radius      : call.width(),
                seconds     : 30,
                fontColor   : '#FFFFFF',
                strokeStyle : '#FF9933',
                fillStyle   : '#223e95',
                autostart   : false,
                label       : false,
                onComplete  : function () {
                    fadeOutClock();
                    calling = false;
                    running = false;
                }
            });

            sounds['beforeCallSound'].play();
            sounds['standardSound'].pause();

            calling = true;
            fadeInClock();
            hasCalled = true;
        });

        $('#help-50').on('click', function() {
            if (!reducedAlternatives) {
                sounds['fiftyFiftySound'].play();
                removeTwoAlternatives();
                reducedAlternatives = !reducedAlternatives;
            }
            $(this).css('opacity', '0.3');
        });

        $('#help-audience').on('click', function() {
           if (!askedAudience) {
               sounds['fiftyFiftySound'].play();
               $(this).css('opacity', '0.3');
               askedAudience = !askedAudience;
           }
        });

        $(document).keypress(function(e) {
            if (e.keyCode == 32) {
                if(calling) {
                    if (!running) {
                        sounds['beforeCallSound'].pause();
                        sounds['duringCallSound'].play();
                        countdown.start();
                        running = true;
                    } else {
                        sounds['duringCallSound'].pause();
                        sounds['finishedCallSound'].play();
                        countdown.stop();
                        fadeOutClock();
                        calling = false;
                        running = false;
                    }
                }
            }
        });
    };

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
                sounds['standardSound'].play();
                clock.remove();
            }
        },1)
    };

    var activateSounds = function() {
        sounds['beforeCallSound'].loop = true;
        sounds['standardSound'].loop = true;
        sounds['standardSound'].autoplay = true;
    };

    var getQuestion = function(id) {
        return questions[id]
    };

    var resetQuestionStyle = function() {
        $('#alternatives').children().css('background-color', '#223e95');
    };

    var removeTwoAlternatives = function() {
        var alternatives = [1, 2, 3, 4];
        alternatives.splice(alternatives.indexOf(lastCorrectAnswer), 1);
        alternatives.splice(alternatives[Math.floor(Math.random() * alternatives.length)], 1);
        $("#alternative-" + alternatives[0].toString()).html("");
        $("#alternative-" + alternatives[1].toString()).html("");
    };

    return {
        init: function(url) {
            console.log('Initiating Millionare.js');
            bindListeners();
            activateSounds();

            // Load questions
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
            question = getQuestion(nextQuestion);
            lastCorrectAnswer = question.correct;
            nextQuestion++
            $('#question h1').html(question.question);
            $(question.alternatives).each(function(index, alternative) {
                id = '#alternative-' + (index + 1);
                $(id).html(alternative);
            });
        },
        lastCorrectAnswer: function() {
            return lastCorrectAnswer
        },
        sounds: sounds,
        reset: resetQuestionStyle
    }
})(jQuery);

var showNextQuestion = true;

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
        else {
            Millionare.reset();
        }
    });
});