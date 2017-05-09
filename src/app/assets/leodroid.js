const redis = require('redis');
const subClient = redis.createClient();
const pubClient = redis.createClient();

subClient.on('ready', () => {
    subClient.subscribe('voice-commands');
});

function listen(callback) {
    subClient.on('message', (channel, message) => {
        callback(message);
    });
}

function say(message) {
    pubClient.publish('text-synthesis', message);
}

module.exports = {
    listen: listen,
    say: say
};
