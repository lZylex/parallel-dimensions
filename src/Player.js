import * as THREE from "three"

export default class Player {
    constructor() {
        this._health = 100;
    }

    instantiateModel() {
        this.playerModel = new THREE.Group();

        this.playerCharacter = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), new THREE.MeshStandardMaterial({ roughness: 0.50, metalness: 0.55, normalScale: new THREE.Vector2(0.15, 0.15), emissive: new THREE.Color(0x0084ff) }));
        this.playerCharacter.castShadow = true;
        this.playerCharacter.receiveShadow = true;
        this.playerModel.add(this.playerCharacter);

        this.leftCollider = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.25, 0.1), new THREE.MeshStandardMaterial({ color: 0xff0000, roughness: 0.50, metalness: 0.55, normalScale: new THREE.Vector2(0.15, 0.15) }));
        this.leftCollider.position.x = -0.105;
        this.leftCollider.position.y = 0.03;
        this.leftCollider.visible = false;
        this.playerModel.add(this.leftCollider);

        this.rightCollider = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.25, 0.1), new THREE.MeshStandardMaterial({ color: 0xff0000, roughness: 0.50, metalness: 0.55, normalScale: new THREE.Vector2(0.15, 0.15) }));
        this.rightCollider.position.x = 0.105;
        this.rightCollider.position.y = 0.03;
        this.rightCollider.visible = false;
        this.playerModel.add(this.rightCollider);

        this.bottomCollider = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.1, 0.1), new THREE.MeshStandardMaterial({ color: 0xff0000, roughness: 0.50, metalness: 0.55, normalScale: new THREE.Vector2(0.15, 0.15) }));
        this.bottomCollider.position.y = -0.105;
        this.bottomCollider.visible = false;
        this.playerModel.add(this.bottomCollider);

        // this.playerModel.position.y = -0.75;
        // this.playerModel.position.x = -4;

        return this.playerModel;
    }
}