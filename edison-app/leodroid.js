const say = window.require('say')
const $ = window.require('jquery')

module.exports = {
    say: function (message) {
        console.log(`Leodroid says: ${message}`);
        say.speak(message);
    },

    listen: function (callback) {
        $('#sayForm').submit(function (event) {
            const message = $('#sayTextBox').val();

            $('#sayTextBox').focus();
            $('#sayTextBox').val('');

            console.log(`You say: ${message}`);
            callback(message);
            return event.preventDefault();
        });
    }
}
