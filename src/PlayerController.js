import * as THREE from "three"
import { Vector2 } from "three"

class PlayerControllerInput {
    constructor(keys) {
        this._keyLeft = { key: keys[0].toLowerCase(), pressed: false };
        this._keyRight = { key: keys[1].toLowerCase(), pressed: false };
        this._keyJump = { key: keys[2].toLowerCase(), pressed: false };
        this._keyForward = { key: "w", pressed: false };
        this._keyBackward = { key: "s", pressed: false };

        this._Init();
    }

    _Init() {
        document.addEventListener("keydown", e => {
            switch (e.key) {
                case this._keyLeft.key:
                    this._keyLeft.pressed = true;
                    break;
                case this._keyRight.key:
                    this._keyRight.pressed = true;
                    break;
                case this._keyJump.key:
                    this._keyJump.pressed = true;
                    break;
                case this._keyForward.key:
                    this._keyForward.pressed = true;
                    break;
                case this._keyBackward.key:
                    this._keyBackward.pressed = true;
                    break;
            }
        })

        document.addEventListener("keyup", e => {
            switch (e.key) {
                case this._keyLeft.key:
                    this._keyLeft.pressed = false;
                    break;
                case this._keyRight.key:
                    this._keyRight.pressed = false;
                    break;
                case this._keyJump.key:
                    this._keyJump.pressed = false;
                    break;
                case this._keyForward.key:
                    this._keyForward.pressed = false;
                    break;
                case this._keyBackward.key:
                    this._keyBackward.pressed = false;
                    break;
                case "r":
                    this.resetLastCheckpoint({ x: 0, y: -0.85 });
                    break;
            }
        })
    }
}

export default class PlayerController extends PlayerControllerInput {
    constructor(keys, playerModel) {
        super(keys);

        this._gravity = -0.15;
        this._acceleration = new Vector2(0.175, 0.4);
        this.velocity = new Vector2(0, 0);
        this._maxVelocity = new Vector2(4.5, 7);

        this.playerModel = playerModel;
        this.inAir = false;
    }

    update(delta, colliders, currentDimension, switchingDimension) {
        if (!switchingDimension) {
            if (this._keyLeft.pressed) {
                if (this.velocity.x > -this._maxVelocity.x) {
                    Math.sign(this.velocity.x) == 1 ? this.velocity.x -= this._acceleration.x * 2.5 : this.velocity.x -= this._acceleration.x;
                } else {
                    this.velocity.x = -this._maxVelocity.x
                }
            }

            if (this._keyRight.pressed) {
                if (this.velocity.x < this._maxVelocity.x) {
                    Math.sign(this.velocity.x) == -1 ? this.velocity.x += this._acceleration.x * 2.5 : this.velocity.x += this._acceleration.x;
                } else {
                    this.velocity.x = this._maxVelocity.x
                }
            }

            if (!this._keyRight.pressed && !this._keyLeft.pressed) {
                if (this.velocity.x <= 0) {
                    this.velocity.x += this._acceleration.x;
                    if (Math.sign(this.velocity.x) === 1) this.velocity.x = 0;
                } else if (this.velocity.x >= 0) {
                    this.velocity.x -= this._acceleration.x;
                    if (Math.sign(this.velocity.x) === -1) this.velocity.x = 0;
                }
            }

            if (colliders.right && this.velocity.x > 0) this.velocity.x = 0;
            if (colliders.left && this.velocity.x < 0) this.velocity.x = 0;

            if (currentDimension !== "Inverted") {
                if (!colliders.bottom) {
                    if (currentDimension !== "No Gravity") this.velocity.y += this._gravity * 1.1;
                    this.inAir = false;
                } else if (colliders.bottom && !this.inAir) {
                    if (currentDimension !== "No Gravity") this.velocity.y = 0;
                    this.inAir = true;
                }
            }

            if (this._keyJump.pressed && this.inAir && currentDimension === "Standard") this.velocity.y = 6.5;

            this.playerModel.position.x += (this.velocity.x * delta);
            this.playerModel.position.y += (this.velocity.y * delta);

            if (currentDimension === "Inverted") {
                if (!colliders.top) {
                    this.velocity.y -= this._gravity * 1.1;
                    this.inAir = false;
                } else if (colliders.top && !this.inAir) {
                    this.velocity.y = 0;
                    this.inAir = true;
                }
                if (this._keyJump.pressed && this.inAir) this.velocity.y = -6.5;
            }
        }

        if (this.playerModel.position.y <= -7.5 || this.playerModel.position.y >= 15.5) {
            this.resetLastCheckpoint({ x: 0, y: -0.85 });
            this.velocity.set(0, 0);
        }
    }

    //TODO: hold to retry
    resetLastCheckpoint(cords) {
        this.playerModel.position.x = cords.x;
        this.playerModel.position.y = cords.y;
    }
}