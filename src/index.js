import * as THREE from "three"
import PlayerController from "./PlayerController.js"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js"
// import { UnrealBloomPass } from "../resources/shaders/UnrealBloomPass.js"

class AppInit {
    constructor() {
        this._initialize();
    }

    _initialize() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        })

        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping; // this one good
        this.renderer.toneMappingExposure = 1.25;


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
        this.scene.background = new THREE.Color(0x000030);

        //post processing stuff
        this.renderScene = new RenderPass(this.scene, this.camera);
        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(this.renderScene);
        // this.bloomPass = new UnrealBloomPass(
        //   new THREE.Vector2(window.innerWidth, window.innerHeight),
        //   1.6,
        //   0.1,
        //   0.1
        // );
        // this.composer.addPass(this.bloomPass);

        this.cube = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.1), new THREE.MeshStandardMaterial({ color: 0xff0000, roughness: 0, metalness: 0.55, normalScale: new THREE.Vector2(0.15, 0.15) }));
        this.cube.castShadow = true;
        this.cube.receiveShadow = true;
        this.cube.position.y = 0.5;
        this.scene.add(this.cube);

        this.ground = new THREE.Mesh(new THREE.BoxGeometry(5, 1, 1), new THREE.MeshStandardMaterial({ color: 0xff0000, roughness: 0.35, metalness: 0.25 }));
        this.ground.receiveShadow = true;
        this.ground.position.y = -1.5;
        this.scene.add(this.ground);

        // this.light = new THREE.DirectionalLight(0xFFFFFF, 1);
        // this.light.position.set(1, 2, 1);
        // this.light.target.position.set(0, 0, 0);
        // this.light.castShadow = true;
        // this.light.shadow.mapSize.width = 4096;
        // this.light.shadow.mapSize.height = 4096;
        // // this.light.shadow.camera.near = 0.01;
        // // this.light.shadow.camera.far = 100;
        // // this.light.shadow.camera.left = -10;
        // // this.light.shadow.camera.right = 10;
        // // this.light.shadow.camera.top = 10;
        // // this.light.shadow.camera.bottom = -10;
        // this.scene.add(this.light);

        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        this.scene.add(this.ambientLight);

        this.pointLight = new THREE.PointLight(0xffffff, 0.2, 10);
        this.pointLight.position.set(2, -1.5, 3);
        this.pointLight.decay = 2;
        this.pointLight.castShadow = true;
        this.scene.add(this.pointLight);

        const helper = new THREE.PointLightHelper(this.pointLight, 2);
        this.scene.add(helper);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.autoRotate = true;

        this.playerController = new PlayerController("a", "d", " ", this.cube);

        this.lastTime = Date.now();
        this.delta;

        this._Animate();
    }

    _Animate() {
        this.delta = (Date.now() - this.lastTime) / 1000;
        if (this.delta > 0.15) this.delta = 0.15;

        requestAnimationFrame(() => this._Animate());

        // this.ground.rotation.y += 0.006;

        this.playerController.update(this.delta, new THREE.Box3().setFromObject(this.cube).intersectsBox(new THREE.Box3().setFromObject(this.ground)));

        this.composer.render();

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

let _APP = null;

window.addEventListener("DOMContentLoaded", () => {
    _APP = new AppInit();
})