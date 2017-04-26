const say = window.require('say');

if (console !== undefined) {
    if (console.log !== undefined) {
        const log = console.log;

        console.log = function (message) {
            log(message);
            document.write(message);
        }
    }
}

module.exports = {
    say: function (message) {
        say.speak(message);
    }
}
