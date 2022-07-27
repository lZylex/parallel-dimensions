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
        this.scene.initialize();

        this.playerController = new PlayerController(localStorage.keybinds.split(","), this.scene.playerModel);

        this.lastTime = Date.now();
        this.delta;

        this.bottomCollided = false;
        this.topCollided = false;
        this.rightCollided = false;
        this.leftCollided = false;

        this.cameraOffset;

        this._Animate();
    }

    _Animate() {
        this.delta = (Date.now() - this.lastTime) / 1000;
        if (this.delta > 0.15) this.delta = 0.15; //low fps cap

        this._CheckCollision();
        this.playerController.update(this.delta, { bottom: this.bottomCollided, right: this.rightCollided, left: this.leftCollided })

        this.scene.playerModel.updateMatrixWorld();
        this.cameraOffset = new THREE.Vector3(0.1, 0.6, 1).applyMatrix4(this.scene.playerModel.matrixWorld);
        this.scene.camera.position.lerp(this.cameraOffset, 0.095);

        localStorage.postprocessing === "true" ? this.scene.composer.render() : this.scene.renderer.render(this.scene, this.scene.camera);

        requestAnimationFrame(() => this._Animate());

        this.lastTime = Date.now();
    }

    _CheckCollision() {
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
}

window.addEventListener("DOMContentLoaded", () => {
    new AppInit();
})