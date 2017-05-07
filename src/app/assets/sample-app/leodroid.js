const say = window.require('say');
const $ = window.require('jquery');

// ********** DIRTY HARDCODE ***************************************
const leodroidContainer = $('#ctrLeodroid')[0];
Crafty.init(370, 370, leodroidContainer);

const ent = Crafty.e('2D, DOM, Motion, Image');
ent.attr({ x: 140, y: 140 })
ent.acceleration().x = 0

const minX = 0,
    minY = 0,
    maxX = 335,
    maxY = 335;

const forwardDirectionVelocity = 20,
    backwardDirectionVelocity = -20,
    noDirectionVelocity = 0;
// ****************************************************************

let _direction = null;
let moved = false, stopped = true;

function setDirection(direction) {
    switch (direction) {
        case "North":
            ent.image("assets/North.png");
            _direction = "North";
            break;
        case "East":
            ent.image("assets/East.png");
            _direction = "East";
            break;
        case "South":
            ent.image("assets/South.png");
            _direction = "South";
            break;
        case "West":
            ent.image("assets/West.png");
            _direction = "West";
            break;
    }
}

function getDirection() {
    return _direction;
}

function move() {
    switch (getDirection()) {
        case "North":
            ent.velocity().x = noDirectionVelocity;
            ent.velocity().y = backwardDirectionVelocity;
            break;
        case "South":
            ent.velocity().x = noDirectionVelocity;
            ent.velocity().y = forwardDirectionVelocity;
            break;
        case "West":
            ent.velocity().x = backwardDirectionVelocity;
            ent.velocity().y = noDirectionVelocity;
            break;
        case "East":
            ent.velocity().x = forwardDirectionVelocity;
            ent.velocity().y = noDirectionVelocity;
            break;
    }
    
    moved = true;
    stopped = false;
}

function stop() {
    ent.resetMotion();
    
    moved = false;
    stopped = true;
}

function turnLeft() {
    if (moved) {
        switch (getDirection()) {
            case "North":
                setDirection("West");
                move();
                break;
            case "South":
                setDirection("East");
                move();
                break;
            case "East":
                setDirection("North");
                move();
                break;
            case "West":
                setDirection("South");
                move();
                break;
        }
    }
}

function turnRight() {
    if (moved) {
        switch (getDirection()) {
            case "North":
                setDirection("East");
                move();
                break;
            case "South":
                setDirection("West");
                move();
                break;
            case "East":
                setDirection("South");
                move();
                break;
            case "West":
                setDirection("North");
                move();
                break;
        }
    }
}

ent.bind("Move", function () {
    if (this.x > maxX && this.y < minY) {
        setDirection("South");
        move();
    } else if (this.x > maxX && this.y > maxY) {
        setDirection("West");
        move();
    } else if (this.x < minX && this.y > maxY) {
        setDirection("North");
        move();
    } else if (this.x < minX && this.y < minY) {
        setDirection("East");
        move();
    } else if (this.x > maxX) {
        setDirection("South");
        move();
    } else if (this.y > maxY) {
        setDirection("West");
        move();
    } else if (this.x < minX) {
        setDirection("North");
        move();
    } else if (this.y < minY) {
        setDirection("East");
        move();
    }
});

setDirection("North");


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
