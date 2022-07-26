import * as THREE from "three"
import PlayerController from "../PlayerController.js"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js"
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js"
import { VignetteShader } from "three/examples/jsm/shaders/VignetteShader.js"
import { PixelShader } from "three/examples/jsm/shaders/PixelShader.js"
import { RGBShiftShader } from "three/examples/jsm/shaders/RGBShiftShader.js"
import MenuNavigator from "./MenuNavigator.js"

//Too lazy to split and refactor, leave as is, just the menu

class AppInit {
    constructor() {
        this._initialize();
    }

    _initialize() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        })

        if (localStorage.length == 0) {
            localStorage.postprocessing = true;
            localStorage.keybinds = ["a", "d", " "];
            localStorage.resolution = 1.0;
        }

        this.renderer.setPixelRatio(window.devicePixelRatio * (parseFloat(localStorage.resolution) ** 1.75));
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping; // this one good
        this.renderer.toneMappingExposure = 0.8;

        document.body.appendChild(this.renderer.domElement);

        window.addEventListener("resize", () => this._OnWindowRezise())

        const LEFT = (window.innerWidth / -2) / 200;
        const RIGHT = (window.innerWidth / 2) / 200;
        const TOP = (window.innerHeight / 2) / 200;
        const BOTTOM = (window.innerHeight / -2) / 200;
        // const FOV = 60;
        // const ASPECT = 1920 / 1080;
        const NEAR = 0.01;
        const FAR = 10000;

        this.camera = new THREE.OrthographicCamera(LEFT, RIGHT, TOP, BOTTOM, NEAR, FAR);
        // this.camera = new THREE.PerspectiveCamera(FOV, ASPECT, NEAR, FAR);
        this.camera.position.set(0, 0, 5);

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x070707);

        //post processing stuff
        this.renderScene = new RenderPass(this.scene, this.camera);
        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(this.renderScene);

        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            0.9,
            0.1,
            0
        );
        this.composer.addPass(bloomPass);

        const vignettePass = new ShaderPass(VignetteShader);
        vignettePass.uniforms["darkness"].value = 1.2;
        this.composer.addPass(vignettePass);

        const pixelPass = new ShaderPass(PixelShader);
        pixelPass.uniforms['resolution'].value = new THREE.Vector2(window.innerWidth, window.innerHeight);
        pixelPass.uniforms['resolution'].value.multiplyScalar(window.devicePixelRatio / 3);
        pixelPass.uniforms['pixelSize'].value = 1.35;
        this.composer.addPass(pixelPass);

        const rgbShiftPass = new ShaderPass(RGBShiftShader);
        rgbShiftPass.uniforms["amount"].value = 0.0015;
        this.composer.addPass(rgbShiftPass);

        this.playerModel = new THREE.Group();

        this.cube = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), new THREE.MeshStandardMaterial({ roughness: 0.50, metalness: 0.55, normalScale: new THREE.Vector2(0.15, 0.15), emissive: new THREE.Color(0x0084ff) }));
        this.cube.castShadow = true;
        this.cube.receiveShadow = true;
        this.playerModel.add(this.cube);

        this.bottomCollider = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.1, 0.1), new THREE.MeshStandardMaterial({ color: 0xff0000, roughness: 0.50, metalness: 0.55, normalScale: new THREE.Vector2(0.15, 0.15) }));
        this.bottomCollider.position.y = -0.105;
        this.bottomCollider.visible = false;
        this.playerModel.add(this.bottomCollider);

        this.rightCollider = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.25, 0.1), new THREE.MeshStandardMaterial({ color: 0xff0000, roughness: 0.50, metalness: 0.55, normalScale: new THREE.Vector2(0.15, 0.15) }));
        this.rightCollider.position.x = 0.105;
        this.rightCollider.position.y = 0.03;
        this.rightCollider.visible = false;
        this.playerModel.add(this.rightCollider);

        this.leftCollider = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.25, 0.1), new THREE.MeshStandardMaterial({ color: 0xff0000, roughness: 0.50, metalness: 0.55, normalScale: new THREE.Vector2(0.15, 0.15) }));
        this.leftCollider.position.x = -0.105;
        this.leftCollider.position.y = 0.03;
        this.leftCollider.visible = false;
        this.playerModel.add(this.leftCollider);

        this.playerModel.position.y = -0.75;
        this.playerModel.position.x = -2.5;
        this.scene.add(this.playerModel);

        this.ground = new THREE.Mesh(new THREE.BoxGeometry(9, 2, 1), new THREE.MeshStandardMaterial({ color: 0x787878, roughness: 0.35, metalness: 0.25 }));
        this.ground.receiveShadow = true;
        this.ground.position.y = -2;
        this.ground.name = "ground";
        this.scene.add(this.ground);

        this.wallRight = new THREE.Mesh(new THREE.BoxGeometry(6, 10, 1), new THREE.MeshStandardMaterial({ color: 0x787878, roughness: 0.35, metalness: 0.25 }));
        this.wallRight.receiveShadow = true;
        this.wallRight.position.x = 6;
        this.wallRight.name = "wall";
        this.scene.add(this.wallRight);

        this.wallLeft = new THREE.Mesh(new THREE.BoxGeometry(6, 10, 1), new THREE.MeshStandardMaterial({ color: 0x787878, roughness: 0.35, metalness: 0.25 }));
        this.wallLeft.receiveShadow = true;
        this.wallLeft.position.x = -6;
        this.wallLeft.name = "wall";
        this.scene.add(this.wallLeft);

        this.ceiling = new THREE.Mesh(new THREE.BoxGeometry(10, 5, 1), new THREE.MeshStandardMaterial({ color: 0x787878, roughness: 0.35, metalness: 0.25 }))
        this.ceiling.position.y = 3.5;
        this.scene.add(this.ceiling);

        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        this.scene.add(this.ambientLight);

        this.scene.add(this._createLevelEntrance(1, 1));
        this.scene.add(this._createLevelEntrance(2.25, 2));
        // this.scene.add(this._createLevelEntrance(3.5, 3));

        this.menuNavigator = new MenuNavigator(this.renderer, false);

        this.playerController = new PlayerController(localStorage.keybinds.split(","), this.playerModel);

        this.lastTime = Date.now();
        this.delta;

        this.bottomCollided = false;
        this.topCollided = false;
        this.rightCollided = false;
        this.leftCollided = false;

        this.levelOpenSpeed = 0;

        this.cameraOffset;

        this.levelSubtext = document.getElementById("level-subtext");
        this.levelSubtext.style.display = "none";

        this._animate();
    }

    _animate() {
        this.delta = (Date.now() - this.lastTime) / 1000;
        if (this.delta > 0.15) this.delta = 0.15; //low fps cap

        requestAnimationFrame(() => this._animate());

        //Collision detection
        for (let i = 0; i < this.scene.children.length; i++) {
            let child = this.scene.children[i];

            if (!this.playerModel.children.includes(child) && child.type === "Mesh" && child.name === "wall") {
                let box = new THREE.Box3();
                box.setFromObject(child);

                this.rightCollided = box.intersectsBox(new THREE.Box3().setFromObject(this.rightCollider));
                this.leftCollided = box.intersectsBox(new THREE.Box3().setFromObject(this.leftCollider));

                // console.log(this.leftCollided, this.rightCollided);

                if (this.rightCollided || this.leftCollided) break; // important line, breaks loop if collider intersects with a bBox
            }
        }

        for (let i = 0; i < this.scene.children.length; i++) {
            let child = this.scene.children[i];

            if (!this.playerModel.children.includes(child) && child.type === "Mesh" && child.name === "ground" || child.name === "wall") {
                let box = new THREE.Box3();
                box.setFromObject(child);

                this.bottomCollided = box.intersectsBox(new THREE.Box3().setFromObject(this.bottomCollider));

                // console.log(this.bottomCollided);

                if (this.bottomCollided) break; // important line, breaks loop if collider intersects with a bBox
            }
        }

        for (let i = 0; i < this.scene.children.length; i++) {
            let child = this.scene.children[i];

            if (!this.playerModel.children.includes(child) && child.type === "Mesh" && child.name === "levelEntrance") {
                let box = new THREE.Box3();
                box.setFromObject(child);

                this.levelOpen = box.intersectsBox(new THREE.Box3().setFromObject(this.cube));

                if (child.scale.y >= 1 && !this.levelOpen) child.scale.y -= 0.06666;
                if (child.scale.x >= 1 && !this.levelOpen) child.scale.x -= 0.06666;

                if (this.levelOpen) {
                    if (child.scale.y <= 2) child.scale.y += 0.066666;
                    if (child.scale.x <= 1.3) child.scale.x += 0.06666;
                    this.levelSubtext.innerText = `Level ${child.stage.level}`;
                    this.levelSubtext.style.animation = "fade-in 0.25s cubic-bezier(0, 0, 0.2, 1) 0s 1 normal forwards";
                    this.levelSubtext.style.display = "flex";
                    document.getElementsByClassName("menu-choice")[0].classList.remove("cnt-play");
                    this.menuNavigator.canEnterLevel = true;
                    localStorage.level = child.stage.level;
                    localStorage.dimensions = child.stage.dimensions;
                    break;
                } else {
                    this.levelSubtext.style.animation = "fade-out 0.25s cubic-bezier(0, 0, 0.2, 1) 0s 1 normal forwards";
                    document.getElementsByClassName("menu-choice")[0].classList.add("cnt-play");
                    this.menuNavigator.canEnterLevel = false;
                }
            }
        }

        this.playerController.update(this.delta, { bottom: this.bottomCollided, right: this.rightCollided, left: this.leftCollided, top: this.topCollided }, "Standard", false);

        this.playerModel.updateMatrixWorld();
        this.cameraOffset = new THREE.Vector3(0.1, 0.6, 4.5).applyMatrix4(this.playerModel.matrixWorld);
        this.camera.position.lerp(this.cameraOffset, 0.095);
        // this.camera.lookAt(this.playerModel);

        localStorage.postprocessing === "true" ? this.composer.render() : this.renderer.render(this.scene, this.camera);

        this.lastTime = Date.now();
    }

    _OnWindowRezise() {
        this.camera.left = (window.innerWidth / -2) / 200;
        this.camera.right = (window.innerWidth / 2) / 200;
        this.camera.top = (window.innerHeight / 2) / 200;
        this.camera.bottom = (window.innerHeight / -2) / 200;

        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    _createLevelEntrance(positionX, level) {
        const levelEntrance = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), new THREE.MeshStandardMaterial({ roughness: 0.80, metalness: 0.55, normalScale: new THREE.Vector2(0.15, 0.15), emissive: new THREE.Color(0x3f436e) }));
        levelEntrance.position.x = positionX;
        levelEntrance.position.y = -0.85;
        levelEntrance.position.z = -0.1;
        levelEntrance.name = "levelEntrance";
        levelEntrance.stage = { level: level, dimensions: "" };

        switch (level) {
            case 1:
                levelEntrance.stage.dimensions = "Standard, No Gravity";
                break;
            case 2:
                levelEntrance.stage.dimensions = "Standard, Inverted";
                break;
            case 3:
                levelEntrance.stage.dimensions = "Standard, No Gravity, Inverted";
                break;
        }

        return levelEntrance;
    }
}

// let _APP = null;

window.addEventListener("DOMContentLoaded", () => {
    // _APP = new AppInit();
    new AppInit();
})