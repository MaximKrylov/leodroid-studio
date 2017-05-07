const say = window.require('say');
const $ = window.require('jquery');

// ********** DIRTY HARDCODE ***************************************
const leodroidContainer = $('#ctrLeodroid')[0];
Crafty.init(370, 370, leodroidContainer);

const ent = Crafty.e('2D, DOM, Motion, Image');
ent.attr({ x: 140, y: 140 })
ent.acceleration().x = 0

const minX = 0, minY = 0, maxX = 335, maxY = 335;
const north = 'North', south = 'South', east = 'East', west = 'West';
const northPic = 'assets/North.png',
    southPic = 'assets/South.png',
    eastPic = 'assets/East.png',
    westPic = 'assets/West.png';
const forwardDirectionVelocity = 20,
    backwardDirectionVelocity = -20,
    noDirectionVelocity = 0;
// ****************************************************************

ent.image(eastPic);
let direction = east;

function move() {
    switch (direction) {
        case north:
            ent.velocity().x = noDirectionVelocity;
            ent.velocity().y = backwardDirectionVelocity;
            break;
        case south:
            ent.velocity().x = noDirectionVelocity;
            ent.velocity().y = forwardDirectionVelocity;
            break;
        case west:
            ent.velocity().x = backwardDirectionVelocity;
            ent.velocity().y = noDirectionVelocity;
            break;
        case east:
            ent.velocity().x = forwardDirectionVelocity;
            ent.velocity().y = noDirectionVelocity;
            break;
    }
}

ent.bind("Move", function (oldPosition) {
    if (this.x > maxX && this.y < minY) {
        direction = south;
        ent.image('assets/South.png');
        move();
    } else if (this.x > maxX && this.y > maxY) {
        direction = west;
        ent.image('assets/West.png');
        move();
    } else if (this.x < minX && this.y > maxY) {
        direction = north;
        ent.image('assets/North.png');
        move();
    } else if (this.x < minX && this.y < minY) {
        direction = east;
        ent.image('assets/East.png');
        move();
    } else if (this.x > maxX) {
        direction = south;
        ent.image('assets/South.png');
        move();
    } else if (this.y > maxY) {
        direction = west;
        ent.image('assets/West.png');
        move();
    } else if (this.x < minX) {
        direction = north;
        ent.image('assets/North.png');
        move();
    } else if (this.y < minY) {
        direction = east;
        ent.image('assets/East.png');
        move();
    }
});

function stop() {
    ent.resetMotion();
}

function turnLeft() {
    switch (direction) {
        case north:
            stop();
            direction = west;
            ent.image('assets/West.png');
            move();
            break;
        case south:
            direction = east;
            ent.image('assets/East.png');
            move();
            break;
        case east:
            direction = north;
            ent.image('assets/North.png');
            move();
            break;
        case west:
            direction = south;
            ent.image('assets/South.png');
            move();
            break;
    }
}

function turnRight() {
    switch (direction) {
        case north:
            stop();
            direction = east;
            ent.image('assets/East.png');
            move();
            break;
        case south:
            stop();
            direction = west;
            ent.image('assets/West.png');
            move();
            break;
        case east:
            stop();
            direction = south;
            ent.image('assets/South.png');
            move();
            break;
        case west:
            stop();
            direction = north;
            ent.image('assets/North.png');
            move();
            break;
    }
}

function turnRound() {

}

module.exports = {
    say: function (message) {
        console.log(`Leodroid says: ${message}`);
        say.speak(message);
    },

    listen: function (callback) {
        $('#formSay').submit(function (event) {
            const message = $('#txtSay').val();

            $('#txtSay').focus();
            $('#txtSay').val('');

            if (message === 'move') {
                say.speak('i am moving');
                move();
            } else if (message === 'stop') {
                say.speak('i am stopping');
                stop();
            } else if (message === 'turn left') {
                say.speak('i am turning left');
                turnLeft();
            } else if (message === 'turn right') {
                say.speak('i am turning right');
                turnRight();
            }

            console.log(`You say: ${message}`);
            callback(message);

            return event.preventDefault();
        });
    }
}
