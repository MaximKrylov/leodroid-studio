const say = window.require('say');

module.exports = {
    say: function (message) {
        say.speak(message);
    },

    listen: function (callback) {
        document.getElementById('sayButton').addEventListener('click', () => {
            const message = document.getElementById('sayTextBox').value;

            document.getElementById('sayTextBox').value = '';
            document.getElementById('sayTextBox').focus();

            callback(message);
        });
    }
}
