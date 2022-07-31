import * as THREE from "three"

export default class StageLoader {
    constructor(scene) {
        this._scene = scene;
    }

    loadStage(stage) {
        switch (parseInt(stage)) {
            case 1:
                this._instantiateWall(1, 10, 0, -6);
                this._instantiateWall(2, 10, 5, -6);
                this._instantiateWall(2, 10, -4.15, -3.575);
                this._createKey(-4.15, 1.95);
                this._instantiateExit(5, -0.85);
                this._instantiateWall(2, 0.35, 5, 1.25);
                this._instantiateWall(0.3, 10, 8, -6);
                this._instantiateWall(0.4, 10, 10, -5.5);
                this._instantiateWall(0.6, 10, 12, -5.2);
                this._instantiateWall(0.6, 10, 16, -5.2);
                this._instantiateWall(0.6, 10, 18, -4.4);
                this._instantiateWall(0.7, 0.35, 16, 1.25);
                this._inventBean(-35, 2.5);
                this._inventBean(-36, 2.5);
                this._inventBean(-37, 2.5);
                break;
            case 2:
                this._instantiateWall(1, 10, 0, -6);
                this._instantiateWall(1, 0.5, 0, 1);
                this._instantiateWall(1, 0.35, -4, 1.2);
                this._instantiateWall(1, 10, 3, -6);
                this._instantiateWall(1, 10, 5.45, -5.5);
                this._instantiateWall(1, 0.5, 7, 2);
                this._instantiateWall(1, 0.5, 5.45, 5);
                this._instantiateWall(1, 0.5, 2.5, 5);
                this._instantiateWall(1, 10, 9, -5.1);
                this._instantiateWall(1, 10, 11.5, -5.1);
                this._instantiateWall(1, 0.5, 12, 2);
                this._instantiateWall(1, 0.25, 12, 4);
                this._createKey(12, 2.5);
                this._instantiateWall(1, 0.25, 9, 4);
                this._instantiateWall(1, 0.35, -2, 5);
                this._instantiateExit(-4, 1.53);
                break;
            case 3:
                this._instantiateWall(5, 10, 0, -6);
                this._instantiateWall(5, 10, 0, 6);
                this._instantiateWall(1.25, 0.5, 6.5, 1.25);
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