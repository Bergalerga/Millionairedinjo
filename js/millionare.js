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
        'fiftyFiftySound': new Audio('sounds/50_50.mp3'),
        'newQuestion' : new Audio('sounds/wechsel_nach_stufe_2.mp3'),
        'bam' : new Audio('sounds/publikumsjoker_ende.mp3'),
        'gameOver' : new Audio('sounds/falsch_kein_gewinn.mp3'),
        'correctAnswer' : new Audio('sounds/richtig_stufe_3.mp3'),
        'outro' : new Audio('sounds/outro.mp3')
    };

    var bindListeners = function() {
        $("#help-call").on("click", function () {
            if (hasCalled) {
                $(this).css('opacity', '1');
            } else {
                $(this).css('opacity', '0.3');

                $(document.body).append('<div id="call"></div>');

                var call = $("#call");
                countdown = call.countdown360({
                    radius: call.width(),
                    seconds: 30,
                    fontColor: '#FFFFFF',
                    strokeStyle: '#FF9933',
                    fillStyle: '#223e95',
                    autostart: false,
                    label: false,
                    onComplete: function () {
                        fadeOutClock();
                        calling = false;
                        running = false;
                    }
                });

                sounds['beforeCallSound'].play();
                sounds['standardSound'].pause();

                calling = true;
                fadeInClock();
            }
            hasCalled = !hasCalled;
        });

        $('#help-50').on('click', function() {
            if (!reducedAlternatives) {
                sounds['fiftyFiftySound'].play();
                removeTwoAlternatives();
                $(this).css('opacity', '0.3');
            } else {
                $(this).css('opacity', '1');
            }
            reducedAlternatives = !reducedAlternatives;
        });

        $('#help-audience').on('click', function() {
           if (!askedAudience) {
               sounds['fiftyFiftySound'].play();
               $(this).css('opacity', '0.3');
           } else {
               $(this).css('opacity', '1');
           }
           askedAudience = !askedAudience;
        });
        sounds['newQuestion'].addEventListener('ended', function(){
            sounds['bam'].play();
            setTimeout(function() {
                populateNextQuestion(getQuestion(nextQuestion));
                sounds['standardSound'].play();
            }, 400);
        });
        sounds['gameOver'].addEventListener('ended', function() {
            clearAllBoxes();
            resetQuestionStyle();
            moneyReached = getQuestion(lastCorrectAnswer - 1).money;
            sounds['outro'].play();
            $("#question > h1").css("font-size", "6em");
            $('#question h1').addClass("blink");
            if (moneyReached >= 100000) {
                $('#question h1').html("$100000");
            }
            else if (moneyReached >= 10000) {
                $('#question h1').html("$10000");
            }
            else if (moneyReached >= 1000) {
                $('#question h1').html("$1000");
            }
            else {
                $('#question h1').html("$0");
            }
        });

        $(document).keypress(function(e) {
            if (e.which == 13) {
                if (showNextQuestion) {
                    clearAllBoxes();
                    $("#money").html("$" + getQuestion(nextQuestion).money);
                    resetQuestionStyle();
                    sounds['newQuestion'].play();

                } else {
                    changeQuestionStyle(lastCorrectAnswer, false);
                }
                showNextQuestion = !showNextQuestion
            }
            else if (e.which == 65 || e.which == 97) {
                changeQuestionStyle(1, true);
                sounds['standardSound'].pause();
            }
            else if (e.which == 66 || e.which == 98) {
                changeQuestionStyle(2, true);
                sounds['standardSound'].pause();
            }
            else if (e.which == 67  || e.which == 99) {
                changeQuestionStyle(3, true);
                sounds['standardSound'].pause();
            }
            else if (e.which == 68 || e.which == 100) {
                changeQuestionStyle(4, true);
                sounds['standardSound'].pause();
            }
            else if (e.which == 32) {
                if(calling) {
                    if (!running) {
                        sounds['beforeCallSound'].pause();
                        sounds['duringCallSound'].currentTime = 0;
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
            else if (e.which == 102 || e.which == 70) {
                clearAllBoxes();
                resetQuestionStyle();
                sounds['standardSound'].pause();
                sounds['outro'].play();
                $("#money").html("");
                $('#question h1').addClass("blink");
                $("#question > h1").css("font-size", "6em");
                $('#question h1').html('$' + getQuestion(lastCorrectAnswer - 1).money);

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
    };

    var getQuestion = function(id) {
        return questions[id]
    };

    var changeQuestionStyle = function(questionId, playSounds) {
        var color = (lastCorrectAnswer == questionId) ? 'green' : 'red';
        $('#question-' + questionId).css('background-color', color);
        if (playSounds) {
            if (color == 'red') {
                gameOver();
            }
            else {
                sounds['correctAnswer'].play();
            }
        }
    };

    var clearAllBoxes = function() {
        $('#question h1').html("");
        $('#money h3').html("$MONEYZ");
        for (var i = 1; i < 5; i++) {
            id = '#alternative-' + i;
            $(id).html("");
        }
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
        //$("#money").html("$" + question.money)
        $(question.alternatives).each(function(index, alternative) {
            id = '#alternative-' + (index + 1);
            $(id).html(alternative);
        });
    };

    var gameOver = function() {
        sounds['standardSound'].pause();
        sounds['gameOver'].play();
    }
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
