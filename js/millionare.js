var Millionaire  = (function($) {

    var questions = [];
    var nextQuestion = 0;
    var lastCorrectAnswer = -1;
    var showNextQuestion = true;
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
            if (e.which == 13) {
                if (showNextQuestion) {
                    resetQuestionStyle();
                    populateNextQuestion(getQuestion(nextQuestion));
                } else {
                    changeQuestionStyle(lastCorrectAnswer);
                }
                showNextQuestion = !showNextQuestion
            }
            else if (e.which == 65 || e.which == 97) {
                changeQuestionStyle(1);
            }
            else if (e.which == 66 || e.which == 98) {
                changeQuestionStyle(2);
            }
            else if (e.which == 67  || e.which == 99) {
                changeQuestionStyle(3);
            }
            else if (e.which == 68 || e.which == 100) {
                changeQuestionStyle(4);
            }
            else if (e.which == 32) {
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
            else {
                resetQuestionStyle()
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
            if(pos >= 250) {
                clearInterval(interval);
            }
        },1)
    };

    var fadeOutClock = function () {
        var pos = 250;
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

    var changeQuestionStyle = function(questionId) {
        var color = (lastCorrectAnswer == questionId) ? 'green' : 'red';
        $('#question-' + questionId).css('background-color', color);
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

    var populateNextQuestion = function(question) {
        lastCorrectAnswer = question.correct;
        nextQuestion++;
        $("#question h1").html(question.question);
        $(question.alternatives).each(function(index, alternative) {
            id = '#alternative-' + (index + 1);
            $(id).html(alternative);
        });
    };

    return {
        init: function(url) {
            console.log('Initiating Millionaire.js');
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
        }
    }
})(jQuery);

$(document).ready(function() {
    Millionaire.init('questions/questions.json');
});
