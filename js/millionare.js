var questions = []
var nextQuestion = 0
var lastCorrectAnswer = -1

var Millionare  = (function($) {

    var getQuestion = function(id) {
        return questions[id]
    }

    return {
        init: function(url) {
            console.log('init')
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
                id = '#question-' + (index + 1) + ' h3'
                $(id).html(alternative);
            });
        },
        lastCorrectAnswer: function() {
            return lastCorrectAnswer
        }
    }

})(jQuery)

var showNextQuestion = true;

function reset() {
    document.getElementById('question-1').style.background = "black";
    document.getElementById('question-2').style.background = "black";
    document.getElementById('question-3').style.background = "black";
    document.getElementById('question-4').style.background = "black";
}

$(document).ready(function() {
    console.log('loaded document')
    Millionare.init('questions/questions.json')
    $(document).keypress(function(e) {
        if (e.which == 13) {
            if (showNextQuestion) {
                Millionare.populateNextQuestion()
            } else {
                alert('Correct is ' + Millionare.lastCorrectAnswer())
            }
            showNextQuestion = !showNextQuestion
        }
        else if (e.which == 65 || e.which == 97) {
            if (lastCorrectAnswer == 1) {
                document.getElementById('question-1').style.background = "green";
            }
            else {
                document.getElementById('question-1').style.background = "red";
            }
        }
        else if (e.which == 66 || e.which == 98) {
            if (lastCorrectAnswer == 2) {
                document.getElementById('question-2').style.background = "green";
            }
            else {
                document.getElementById('question-2').style.background = "red";
            }
        }
        else if (e.which == 67  || e.which == 99) {
            if (lastCorrectAnswer == 3) {
                document.getElementById('question-3').style.background = "green";
            }
            else {
                document.getElementById('question-3').style.background = "red";
            }
        }
        else if (e.which == 68 || e.which == 100) {
            if (lastCorrectAnswer == 4) {
                document.getElementById('question-4').style.background = "green";
            }
            else {
                document.getElementById('question-4').style.background = "red";
            }
        }
        else {
            reset()
        }
    })
})
