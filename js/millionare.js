var Millionare  = (function($) {

    var questions = []


    return {
        init: function(url) {
            console.log('init')
            $.ajax({
                url: url,
                dataType: 'json',
                success: function(result) {
                    console.log(result)
                },
                error: function(err) {
                    console.log(err)
                }
            });
        }
    }

})(jQuery)


$(document).ready(function() {
    console.log('loaded document')
    Millionare.init('questions/questions.json')
})
