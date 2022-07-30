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

        this._addEventListener();

        this.lastTime = Date.now();
        this.delta;

        this.bottomCollided = false;
        this.topCollided = false;
        this.rightCollided = false;
        this.leftCollided = false;

        this.cameraOffset;

        this.playerController = new PlayerController(localStorage.keybinds.split(","), this.scene.playerModel);
        this.scene.player.addDimensionSwitcher(this.playerController.velocity, this.scene.glitchPass);

        this.exitSubtext = document.getElementById("exit-indicator-subtext");
        this.exitSubtext.style.display = "none";
        this.hasKey = false;

        this._animate();
    }

    _animate() {
        this.delta = (Date.now() - this.lastTime) / 1000;
        if (this.delta > 0.010) this.delta = 0.010; //low fps cap

        this._checkCollision();
        this._checkInversion();

        this.playerController.update(this.delta, { bottom: this.bottomCollided, right: this.rightCollided, left: this.leftCollided, top: this.topCollided }, this.scene.player.currentDimension, this.scene.player.switchDimension);
        this.playerController.inAir ? this.scene.player.canSwitch = true : this.scene.player.canSwitch = false;

        this.scene.playerModel.updateMatrixWorld();
        this.cameraOffset = new THREE.Vector3(0.1, 0.6, 4.5).applyMatrix4(this.scene.playerModel.matrixWorld);
        this.scene.camera.position.lerp(this.cameraOffset, 0.095);

        this.scene.playerModel.position.x <= -11 ? document.getElementById("bean-indicator").style.display = "flex" : document.getElementById("bean-indicator").style.display = "none";

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
                this.topCollided = box.intersectsBox(new THREE.Box3().setFromObject(this.scene.playerModel.children[4]));

                if (this.bottomCollided || this.topCollided) break;
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

        for (let i = 0; i < this.scene.children.length; i++) {
            let child = this.scene.children[i];

            if (!this.scene.playerModel.children.includes(child) && child.type === "Mesh" && child.name === "exit") {
                let box = new THREE.Box3();
                box.setFromObject(child);

                if (this.hasKey) this.exitOpen = box.intersectsBox(new THREE.Box3().setFromObject(this.scene.playerModel.children[0]));

                if (child.scale.y >= 1.1 && !this.exitOpen) child.scale.y -= 0.06666;
                if (child.scale.x >= 1.1 && !this.exitOpen) child.scale.x -= 0.06666;

                if (this.exitOpen) {
                    if (child.scale.y <= 2) child.scale.y += 0.066666;
                    if (child.scale.x <= 1.3) child.scale.x += 0.06666;
                    this.exitSubtext.style.display = "flex";
                    this.exitSubtext.style.animation = "fade-in 0.25s cubic-bezier(0, 0, 0.2, 1) 0s 1 normal forwards"
                } else {
                    this.exitSubtext.style.animation = "fade-out 0.25s cubic-bezier(0, 0, 0.2, 1) 0s 1 normal forwards"
                }
            }

            if (!this.scene.playerModel.children.includes(child) && child.type === "Mesh" && child.name === "key") {
                let box = new THREE.Box3();
                box.setFromObject(child);

                this.hasKey = box.intersectsBox(new THREE.Box3().setFromObject(this.scene.playerModel.children[0]));

                if (this.hasKey) this.scene.remove(child);
            }

            if (child.name === "bean") {
                child.rotation.x += 0.05;
                child.rotation.y += 0.01;
                child.rotation.z += 0.05;
            }
        }
    }

    _checkInversion() {
        if (this.scene.player.currentDimension === "Inverted") {
            this.scene.playerModel.children[1].position.y = -0.03;
            this.scene.playerModel.children[2].position.y = -0.03;
        } else {
            this.scene.playerModel.children[1].position.y = 0.03;
            this.scene.playerModel.children[2].position.y = 0.03;
        }
    }

    _addEventListener() {
        window.addEventListener("keydown", e => {
            switch (e.key.toLowerCase()) {
                case "escape":
                    console.log("insert escape menu here");
                    break;
                case "enter":
                    if (this.exitOpen) window.location.href = "/menu.html";
                    break;
            }
        })
    }
}

window.addEventListener("DOMContentLoaded", () => {
    new AppInit();
})