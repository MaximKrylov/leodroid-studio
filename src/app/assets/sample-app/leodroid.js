const say = window.require('say');
const $ = window.require('jquery');

const currPosition = {
    x: 140,
    y: 140
}

// ********** DIRTY HARDCODE ***************************************
const leodroidContainer = $('#ctrLeodroid')[0];
Crafty.init(370, 370, leodroidContainer);

const ent = Crafty.e('2D, DOM, Motion, Image');
ent.attr({ x: currPosition.x, y: currPosition.y })
ent.acceleration().x = 0

const leftLim = 0,
    topLim = 0,
    rightLim = 335,
    bottomLim = 335;

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
                if(currPosition.x < leftLim) {
                    _say('I\'m turning right');
                    break;
                }
                setDirection("West");
                move();
                break;
            case "South":
                if(currPosition.x > rightLim) {
                    _say('I\'m turning right');
                    break;
                }
                setDirection("East");
                move();
                break;
            case "East":
                if(currPosition.y < topLim) {
                    _say('I\'m turning right');
                    break;
                }
                setDirection("North");
                move();
                break;
            case "West":
                if(currPosition.y > bottomLim) {
                    _say('I\'m turning right');
                    break;
                }
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
    if (this.x > rightLim && this.y < topLim) {
        setDirection("South");
        move();
    } else if (this.x > rightLim && this.y > bottomLim) {
        setDirection("West");
        move();
    } else if (this.x < leftLim && this.y > bottomLim) {
        setDirection("North");
        move();
    } else if (this.x < leftLim && this.y < topLim) {
        setDirection("East");
        move();
    } else if (this.x > rightLim) {
        setDirection("South");
        move();
    } else if (this.y > bottomLim) {
        setDirection("West");
        move();
    } else if (this.x < leftLim) {
        setDirection("North");
        move();
    } else if (this.y < topLim) {
        setDirection("East");
        move();
    }

    currPosition.x = this.x;
    currPosition.y = this.y;
});

setDirection("North");

var _say = function(message) {
    console.log(`Leodroid says: ${message}`);
    say.speak(message);
}

var _listen = function(callback) {
    $('#formSay').submit(function (event) {
        const message = $('#txtSay').val();
        console.log(`You say: ${message}`);

        $('#txtSay').focus();
        $('#txtSay').val('');

        if (message === 'move') {
            _say('I\'am moving');
            move();
        } else if (message === 'stop') {
            _say('I\'m stopping');
            stop();
        } else if (message === 'turn left') {
            _say('I\'m turning left');
            turnLeft();
        } else if (message === 'turn right') {
            _say('I\'m turning right');
            turnRight();
        }

        callback(message);

        return event.preventDefault();
    });
}

module.exports = {
    say: _say,
    listen: _listen
}
