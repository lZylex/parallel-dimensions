import * as THREE from "three"

export default class StageLoader {
    constructor(scene) {
        this._scene = scene;
    }

    loadStage(stage) {
        switch (parseInt(stage)) {
            case 1:
                this._instantiateWall(1, 10, 0, -6);
                this._instantiateWall(2, 10, 3, -6);
                this._createKey(1, 0);
                this._instantiateExit(3, -0.85);
                this._inventBean(-11, 0);
                this._inventBean(-12, 0);
                this._inventBean(-13, 0);
                break;
            case 2:
                this._instantiateWall(1, 10, 0, -6);
                break;
            case 3:
                break;
        }
    }

    _instantiateWall(width, height, x, y) {
        this.wall = new THREE.Mesh(new THREE.BoxGeometry(width, height, 1), new THREE.MeshStandardMaterial({ color: 0x787878, metalness: 0.25 }));
        this.wall.receiveShadow = true;
        this.wall.position.x = x;
        this.wall.position.y = y;
        this.wall.name = "wall";

        this._scene.add(this.wall);
    }

    _instantiateExit(x, y) {
        this.exit = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), new THREE.MeshStandardMaterial({ roughness: 0.80, metalness: 0.55, normalScale: new THREE.Vector2(0.15, 0.15), emissive: new THREE.Color(0x552bad) }));
        this.exit.position.x = x;
        this.exit.position.y = y;
        this.exit.position.z = -0.1;
        this.exit.name = "exit";

        this._scene.add(this.exit);
    }

    _createKey(x, y) {
        this.key = new THREE.Mesh(new THREE.BoxGeometry(0.115, 0.15, 0.125), new THREE.MeshStandardMaterial({ roughness: 0.80, metalness: 0.55, normalScale: new THREE.Vector2(0.15, 0.15), emissive: new THREE.Color(0x552bad) }));
        this.key.position.x = x;
        this.key.position.y = y;
        this.key.position.z = -0.1;
        this.key.name = "key";

        this._scene.add(this.key);
    }

    _inventBean(x, y) { // suspicious
        this.bean = new THREE.Mesh(new THREE.CapsuleGeometry(0.1, 0.2, 32, 64), new THREE.MeshBasicMaterial({ color: 0x402300 }));
        this.bean.position.x = x;
        this.bean.position.y = y;
        this.bean.name = "bean";
        this._scene.add(this.bean)
    }
}