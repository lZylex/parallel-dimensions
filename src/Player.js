import * as THREE from "three"

export default class Player {
    constructor() {
        this.currentDimension = "standard";
        this.unlockedDimensions = ["standard", "noGrav", "3D"];
        this.currentIndex = 0;
        this.switchDimension = false;
        //3d, your perceive the 3d dimension, your vision is locked to one point though
        //"3D", "flipped"
        this.shiftKeyDown = false;
        this.canSwitch = false;

        this.addDimensionSwitcher();
    }

    instantiateModel() {
        this.playerModel = new THREE.Group();

        this._playerCharacter = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), new THREE.MeshStandardMaterial({ roughness: 0.50, metalness: 0.55, normalScale: new THREE.Vector2(0.15, 0.15), emissive: new THREE.Color(0x0084ff) }));
        this._playerCharacter.castShadow = true;
        this._playerCharacter.receiveShadow = true;
        this.playerModel.add(this._playerCharacter);

        this._leftCollider = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.25, 0.1), new THREE.MeshStandardMaterial({ color: 0xff0000, roughness: 0.50, metalness: 0.55, normalScale: new THREE.Vector2(0.15, 0.15) }));
        this._leftCollider.position.x = -0.105;
        this._leftCollider.position.y = 0.03;
        this._leftCollider.visible = false;
        this.playerModel.add(this._leftCollider);

        this._rightCollider = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.25, 0.1), new THREE.MeshStandardMaterial({ color: 0xff0000, roughness: 0.50, metalness: 0.55, normalScale: new THREE.Vector2(0.15, 0.15) }));
        this._rightCollider.position.x = 0.105;
        this._rightCollider.position.y = 0.03;
        this._rightCollider.visible = false;
        this.playerModel.add(this._rightCollider);

        this._bottomCollider = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.1, 0.1), new THREE.MeshStandardMaterial({ color: 0xff0000, roughness: 0.50, metalness: 0.55, normalScale: new THREE.Vector2(0.15, 0.15) }));
        this._bottomCollider.position.y = -0.105;
        this._bottomCollider.visible = false;
        this.playerModel.add(this._bottomCollider);

        // this.playerModel.position.y = -0.75;
        // this.playerModel.position.x = -4;

        return this.playerModel;
    }

    addDimensionSwitcher() {
        document.addEventListener("keydown", e => {
            if (this.canSwitch) {
                if (e.key.toLowerCase() === "shift") this.shiftKeyDown = true;
                this.switchDimension = true;

                if (this.shiftKeyDown) {
                    switch (e.key.toLowerCase()) {
                        case "arrowleft":
                            if (this.currentIndex - 1 == -1) {
                                this.currentIndex = this.unlockedDimensions.length - 1;
                            } else this.currentIndex -= 1;
                            console.log(this.unlockedDimensions[this.currentIndex])
                            break;
                        case "arrowRight":
                            break;
                    }
                }
            }
            this.currentDimension = this.unlockedDimensions[this.currentIndex];
        })

        document.addEventListener("keyup", e => {
            if (e.key.toLowerCase() === "shift") {
                this.shiftKeyDown = false;
                this.switchDimension = false;
            }
        })
    }
}

//["xa12m"] + 1 - xc ** 1.4