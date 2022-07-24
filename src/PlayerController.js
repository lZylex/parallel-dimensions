import * as THREE from "three"
import { Vector2 } from "three"

class PlayerControllerInput {
    constructor(keyLeft, keyRight, keyJump) {
        this._keyLeft = { key: keyLeft.toLowerCase(), pressed: false };
        this._keyRight = { key: keyRight.toLowerCase(), pressed: false };
        this._keyJump = { key: keyJump.toLowerCase(), pressed: false };

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
            }
        })
    }
}

export default class PlayerController extends PlayerControllerInput {
    constructor(keyLeft, keyRight, keyJump, playerModel) {
        super(keyLeft, keyRight, keyJump);

        this._gravity = -0.15;
        this._acceleration = new Vector2(0.15, 0.4);
        this._velocity = new Vector2(0, 0);
        this._maxVelocity = new Vector2(6, 7);

        this.playerModel = playerModel;
        this.inAir = false;
    }

    update(delta, colliders) {
        if (this._keyLeft.pressed) {
            if (this._velocity.x > -this._maxVelocity.x) {
                Math.sign(this._velocity.x) == 1 ? this._velocity.x -= this._acceleration.x * 2.5 : this._velocity.x -= this._acceleration.x;
            } else {
                this._velocity.x = -this._maxVelocity.x
            }
        }

        if (this._keyRight.pressed) {
            if (this._velocity.x < this._maxVelocity.x) {
                Math.sign(this._velocity.x) == -1 ? this._velocity.x += this._acceleration.x * 2.5 : this._velocity.x += this._acceleration.x;
            } else {
                this._velocity.x = this._maxVelocity.x
            }
        }

        if (!this._keyRight.pressed && !this._keyLeft.pressed) {
            if (this._velocity.x <= 0) {
                this._velocity.x += this._acceleration.x;
                if (Math.sign(this._velocity.x) === 1) this._velocity.x = 0;
            } else if (this._velocity.x >= 0) {
                this._velocity.x -= this._acceleration.x;
                if (Math.sign(this._velocity.x) === -1) this._velocity.x = 0;
            }
        }

        if (colliders.right && this._velocity.x > 0) this._velocity.x = 0;
        if (colliders.left && this._velocity.x < 0) this._velocity.x = 0;

        if (!colliders.bottom) {
            this._velocity.y += this._gravity * 1.1;
            this.inAir = false;
        } else if (colliders.bottom && !this.inAir) {
            this._velocity.y = 0;
            this.inAir = true;
        }

        if (this._keyJump.pressed && this.inAir) this._velocity.y = 6.5;

        this.playerModel.position.x += (this._velocity.x * delta);
        this.playerModel.position.y += (this._velocity.y * delta);
    }
}