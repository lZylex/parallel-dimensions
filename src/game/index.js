import * as THREE from "three"
import SceneSetup from "./SceneSetup.js"
import PlayerController from "../PlayerController.js"

//changed stuff here, differs from menu a bit
//TODO: Escape menu
//TODO: Make map, map loading from file
//TODO: Work on mechanics
//TODO: Work on bean mode lol
class AppInit {
    constructor() {
        this._initialize();
    }

    _initialize() {
        this.scene = new SceneSetup();
        this.scene.initialize(false);

        this.lastTime = Date.now();
        this.delta;

        this.bottomCollided = false;
        this.topCollided = false;
        this.rightCollided = false;
        this.leftCollided = false;

        this.cameraOffset;


        this.playerController = new PlayerController(localStorage.keybinds.split(","), this.scene.playerModel);
        this.scene.player.addDimensionSwitcher(this.playerController.velocity, this.scene.glitchPass);

        this._animate();
    }

    _animate() {
        this.delta = (Date.now() - this.lastTime) / 1000;
        if (this.delta > 0.010) this.delta = 0.010; //low fps cap

        this._checkCollision();

        this.playerController.update(this.delta, { bottom: this.bottomCollided, right: this.rightCollided, left: this.leftCollided }, this.scene.player.currentDimension, this.scene.player.switchDimension);
        this.playerController.inAir ? this.scene.player.canSwitch = true : this.scene.player.canSwitch = false;

        if (this.scene.player.switchDimension) this._switch();

        if (this.scene.player.currentDimension !== "Three Dimensions") {
            this.scene.playerModel.updateMatrixWorld();
            this.cameraOffset = new THREE.Vector3(0.1, 0.6, 4.5).applyMatrix4(this.scene.playerModel.matrixWorld);
            this.scene.camera.position.lerp(this.cameraOffset, 0.095);
        }

        localStorage.postprocessing === "true" ? this.scene.composer.render() : this.scene.renderer.render(this.scene, this.scene.camera);

        requestAnimationFrame(() => this._animate());

        this.lastTime = Date.now();
    }

    _checkCollision() {
        for (let i = 0; i < this.scene.children.length; i++) {
            let child = this.scene.children[i];

            if (!this.scene.playerModel.children.includes(child) && child.type === "Mesh" && child.name === "wall" || child.name === "ground") {
                let box = new THREE.Box3();
                box.setFromObject(child);

                this.leftCollided = box.intersectsBox(new THREE.Box3().setFromObject(this.scene.playerModel.children[1]));
                this.rightCollided = box.intersectsBox(new THREE.Box3().setFromObject(this.scene.playerModel.children[2]));

                this.bottomCollided = box.intersectsBox(new THREE.Box3().setFromObject(this.scene.playerModel.children[3]));

                if (this.bottomCollided) break;
            }
        }

        for (let i = 0; i < this.scene.children.length; i++) {
            let child = this.scene.children[i];

            if (!this.scene.playerModel.children.includes(child) && child.type === "Mesh" && child.name === "wall") {
                let box = new THREE.Box3();
                box.setFromObject(child);

                this.leftCollided = box.intersectsBox(new THREE.Box3().setFromObject(this.scene.playerModel.children[1]));
                this.rightCollided = box.intersectsBox(new THREE.Box3().setFromObject(this.scene.playerModel.children[2]));

                if (this.rightCollided || this.leftCollided) break;
            }
        }
    }

    _switch() {
        if (this.scene.player.currentDimension == "Three Dimensions") {
            this.scene.camera.position.set(3.96, 1.24, 2.75);
            this.scene.camera.rotation.set(-0.6, 0.88, 0.49);
        } else {
            this.scene.camera.rotation.set(0, 0, 0);
        }
    }
}

window.addEventListener("DOMContentLoaded", () => {
    new AppInit();
})