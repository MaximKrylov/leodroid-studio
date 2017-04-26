const say = window.require('say');

console.log = function (str) {
    document.write(str);
}

module.exports = {
    say: function (message) {
        say.speak(message);
    }
}
