const say = window.require('say')
const $ = window.require('jquery')

Crafty.init(370, 370, document.getElementById('leodroid'));
let ent = Crafty.e('2D, DOM, Color, Motion, Image');
ent.attr({ x: 140, y: 140}).image('assets/East.png')
ent.acceleration().x = 0

const minX = 0, minY = 0, maxX = 310, maxY = 310;
const north = 'North', south = 'South', east = 'East', west = 'West';
const forwardDirectionVelocity = 20, backwardDirectionVelocity = -20, noDirectionVelocity = 0;

let direction = east;

function move() {
    switch(direction) {
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
        console.log(this.x + ' ' + this.y);
    } else if (this.x > maxX && this.y > maxY) {
        direction = west;
        ent.image('assets/West.png');
        move();
        console.log(this.x + ' ' + this.y);
    } else if (this.x < minX && this.y > maxY) {
        direction = north;
        ent.image('assets/North.png');
        move();
        console.log(this.x + ' ' + this.y);
    } else if (this.x < minX && this.y < minY) {
        direction = east;
        ent.image('assets/East.png');
        move();
        console.log(this.x + ' ' + this.y);
    } else if (this.x > maxX) {
        direction = south;
        ent.image('assets/South.png');
        move();
        console.log(this.x + ' ' + this.y);
    } else if (this.y > maxY) {
        direction = west;
        ent.image('assets/West.png');
        move();
        console.log(this.x + ' ' + this.y);
    } else if (this.x < minX) {
        direction = north;
        ent.image('assets/North.png');
        move();
        console.log(this.x + ' ' + this.y);
    } else if (this.y < minY) {
        direction = east;
        ent.image('assets/East.png');
        move();
        console.log(this.x + ' ' + this.y);
    }
});

function stop() {
    ent.resetMotion();
}

function turnLeft() {
    switch(direction) {
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
            ent.imge('assets/South.png');
            move();
            break;
    }
}

function turnRight() {
    switch(direction) {
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
        $('#sayForm').submit(function (event) {
            const message = $('#sayTextBox').val();

            $('#sayTextBox').focus();
            $('#sayTextBox').val('');
            
            if(message === 'move') move();
            else if (message === 'stop') stop();
            else if (message === 'turn left') turnLeft();
            else if (message === 'turn right') turnRight();

            console.log(`You say: ${message}`);
            callback(message);

            return event.preventDefault();
        });
    }
}
