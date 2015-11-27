var Millionare  = (function($) {

    var questions = []
    var nextQuestion = 0
    var lastCorrectAnswer = -1

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
    })
})
