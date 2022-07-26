import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js"
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js"
import { VignetteShader } from "three/examples/jsm/shaders/VignetteShader.js"
import { PixelShader } from "three/examples/jsm/shaders/PixelShader.js"
import { RGBShiftShader } from "three/examples/jsm/shaders/RGBShiftShader.js"
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass.js"
import StageLoader from "./StageLoader.js"
import Player from "../Player.js"

//This subclass extended from the built in THREE.Scene acts like an initializer for the game scene as it initializes everything as properties and saves the hassle of creating
//everything manually. It also keeps the initialisation of the scene compact. 
export default class SceneSetup extends THREE.Scene {
    constructor() {
        super();
    }

    initialize(debug) {
        this.renderer = new THREE.WebGL1Renderer({
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
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 0.8;

        document.body.appendChild(this.renderer.domElement);

        const LEFT = (window.innerWidth / -2) / 200;
        const RIGHT = (window.innerWidth / 2) / 200;
        const TOP = (window.innerHeight / 2) / 200;
        const BOTTOM = (window.innerHeight / -2) / 200;
        const NEAR = 0.01;
        const FAR = 10000;

        this.camera = new THREE.OrthographicCamera(LEFT, RIGHT, TOP, BOTTOM, NEAR, FAR);
        this.camera.position.set(0, 0, 5);

        SceneSetup.addWindowResize(this.camera, this.renderer);

        this.background = new THREE.Color(0x070707);

        this.renderScene = new RenderPass(this, this.camera);
        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(this.renderScene);

        //post processing stuff
        const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.9, 0.1, 0);
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

        this.glitchPass = new GlitchPass();
        this.glitchPass.randX = 0;
        this.composer.addPass(this.glitchPass);

        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        this.add(this.ambientLight);

        this.player = new Player();
        this.playerModel = this.player.instantiateModel();

        this.add(this.playerModel);

        this.stageLoader = new StageLoader(this);
        this.stageLoader.loadStage(localStorage.level);

        if (debug) new OrbitControls(this.camera, this.renderer.domElement);
    }

    static addWindowResize(camera, renderer) {
        window.addEventListener("resize", () => {
            camera.left = (window.innerWidth / -2) / 200;
            camera.right = (window.innerWidth / 2) / 200;
            camera.top = (window.innerHeight / 2) / 200;
            camera.bottom = (window.innerHeight / -2) / 200;

            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }, false);
    }
}