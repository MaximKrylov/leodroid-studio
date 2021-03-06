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
let moved = false;

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
}

function stop() {
    ent.resetMotion();

    moved = false;
}

function turnLeft() {
    if (moved) {
        switch (getDirection()) {
            case "North":
                if (currPosition.x < leftLim) {
                    break;
                }
                setDirection("West");
                move();
                break;
            case "South":
                if (currPosition.x > rightLim) {
                    break;
                }
                setDirection("East");
                move();
                break;
            case "East":
                if (currPosition.y < topLim) {
                    break;
                }
                setDirection("North");
                move();
                break;
            case "West":
                if (currPosition.y > bottomLim) {
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

var _say = function (message) {
    console.log(`Leodroid says: ${message}`);
    say.speak(message);
}

var _listen = function (callback) {
    $('#formSay').submit(function (event) {
        const message = $('#txtSay').val();
        console.log(`You say: ${message}`);

        switch (message) {
            case 'move':
                if (!moved) {
                    _say('I\'am moving');
                    move();
                }
                break;
            case 'turn left':
                if (moved
                    && currPosition.x < rightLim
                    && currPosition.x > leftLim
                    && currPosition.y < bottomLim
                    && currPosition.y > topLim) {
                    _say('I\'m turning left');
                    turnLeft();
                }
                break;
            case 'turn right':
                if (moved) {
                    _say('I\'m turning right');
                    turnRight();
                }
                break;
            case 'stop':
                if (moved) {
                    _say('I\'m stopping');
                    stop();
                }
                break;
            case 'your name':
                _say('I\'m Leodroid v1.0!');
                break;
        }

        $('#txtSay').focus();
        $('#txtSay').val('');

        callback(message);
        return event.preventDefault();
    });
}

module.exports = {
    say: _say,
    listen: _listen
}
