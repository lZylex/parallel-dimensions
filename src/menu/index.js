import * as THREE from "three"
import PlayerController from "../PlayerController.js"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js"
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js"
import { VignetteShader } from "three/examples/jsm/shaders/VignetteShader.js"
import { PixelShader } from "three/examples/jsm/shaders/PixelShader.js"
import MenuNavigator from "./MenuNavigator.js"

//Too lazy to split and refactor, leave as is, just the menu

class AppInit {
    constructor() {
        this._Initialize();
    }

    _Initialize() {
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
        this.scene.background = new THREE.Color(0x000000);

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
        pixelPass.uniforms['pixelSize'].value = 1;
        this.composer.addPass(pixelPass);

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
        this.playerModel.position.x = -4;
        this.scene.add(this.playerModel);

        this.ground = new THREE.Mesh(new THREE.BoxGeometry(10, 2, 1), new THREE.MeshStandardMaterial({ color: 0x787878, roughness: 0.35, metalness: 0.25 }));
        this.ground.receiveShadow = true;
        this.ground.position.y = -2;
        this.ground.name = "ground";
        this.scene.add(this.ground);

        // this.groundRight = new THREE.Mesh(new THREE.BoxGeometry(3, 4, 1), new THREE.MeshStandardMaterial({ color: 0x787878, roughness: 0.35, metalness: 0.25 }));
        // this.groundRight.receiveShadow = true;
        // this.groundRight.position.x = 5;
        // this.groundRight.position.y = -2.4;
        // this.groundRight.name = "ground";
        // this.scene.add(this.groundRight);

        this.wallRight = new THREE.Mesh(new THREE.BoxGeometry(5, 4, 1), new THREE.MeshStandardMaterial({ color: 0x787878, roughness: 0.35, metalness: 0.25 }));
        this.wallRight.receiveShadow = true;
        this.wallRight.position.x = 1;
        this.wallRight.position.y = -2.5;
        this.wallRight.name = "wall";
        this.scene.add(this.wallRight);

        this.wallLeft = new THREE.Mesh(new THREE.BoxGeometry(6, 10, 1), new THREE.MeshStandardMaterial({ color: 0x787878, roughness: 0.35, metalness: 0.25 }));
        this.wallLeft.receiveShadow = true;
        this.wallLeft.position.x = -8;
        this.wallLeft.name = "wall";
        this.scene.add(this.wallLeft);

        this.ceiling = new THREE.Mesh(new THREE.BoxGeometry(10, 5, 1), new THREE.MeshStandardMaterial({ color: 0x787878, roughness: 0.35, metalness: 0.25 }))
        this.ceiling.position.y = 3.5;
        this.scene.add(this.ceiling);

        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        this.scene.add(this.ambientLight);

        // this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        new MenuNavigator(this.renderer);

        this.playerController = new PlayerController(localStorage.keybinds.split(","), this.playerModel);

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

        requestAnimationFrame(() => this._Animate());

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

        this.playerController.update(this.delta, { bottom: this.bottomCollided, right: this.rightCollided, left: this.leftCollided, top: this.topCollided });

        this.playerModel.updateMatrixWorld();
        this.cameraOffset = new THREE.Vector3(0.1, 0.6, 1).applyMatrix4(this.playerModel.matrixWorld);
        this.camera.position.lerp(this.cameraOffset, 0.095);
        // this.camera.lookAt(this.playerModel);

        // this.camera.position.x = this.playerModel.position.x;

        // if (localStorage.postprocessing === "true") {
        //     this.composer.render();
        // } else {
        //     this.renderer.render(this.scene, this.camera);
        // }

        localStorage.postprocessing === "true" ? this.composer.render() : this.renderer.render(this.scene, this.camera);

        //else this.renderer.render(this.scene, this.camera);
        // 

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
}

// let _APP = null;

window.addEventListener("DOMContentLoaded", () => {
    // _APP = new AppInit();
    new AppInit();
})