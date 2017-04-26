const say = window.require('say');

module.exports = {
    say: function (message) {
        say.speak(message);
    }
}
