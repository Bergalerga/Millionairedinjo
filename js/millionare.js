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

})(jQuery)

var showNextQuestion = true;

$(document).ready(function() {
    Millionare.init('questions/questions.json')

    $(document).keypress(function(e) {
        var lastCorrectAnswer = Millionare.lastCorrectAnswer()
        var question;
        if (e.which == 13) {
            if (showNextQuestion) {
                Millionare.reset()
                Millionare.populateNextQuestion()
            } else {
                question = $('#question-' + lastCorrectAnswer).css('background-color', 'green')
            }
            showNextQuestion = !showNextQuestion
        }
        else if (e.which == 65 || e.which == 97) {
            question = $('#question-1');
            (lastCorrectAnswer == 1) ? $(question).css('background-color', 'green') : $(question).css('background-color', 'red')
        }
        else if (e.which == 66 || e.which == 98) {
            question = $('#question-2');
            (lastCorrectAnswer == 2) ? $(question).css('background-color', 'green') : $(question).css('background-color', 'red')
        }
        else if (e.which == 67  || e.which == 99) {
            question = $('#question-3');
            (lastCorrectAnswer == 3) ? $(question).css('background-color', 'green') : $(question).css('background-color', 'red')
        }
        else if (e.which == 68 || e.which == 100) {
            question = $('#question-4');
            (lastCorrectAnswer == 4) ? $(question).css('background-color', 'green') : $(question).css('background-color', 'red')
        }
        //Keyboard button 5
        else if (e.which == 53) {
            var answs = [1,2,3,4]
            console.log(answs.indexOf(lastCorrectAnswer))
            answs.splice(answs.indexOf(lastCorrectAnswer), 1)
            answs.splice(answs[Math.floor(Math.random()*answs.length)], 1)
            q1 = $("#alternative-" + answs[0].toString()).html("");
            q2 = $("#alternative-" + answs[1].toString()).html("");
        }
        else {
            Millionare.reset();
        }
    })
})
