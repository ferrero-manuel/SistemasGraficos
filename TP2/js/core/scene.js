class glScene {
    constructor() {
        this.nodes = [];
        this.camera = [];
        this.dirLight = [];
    }

    addNode(node) {
        this.nodes.push(node);
    }

    setCamera(camera) {
        this.camera = camera;
    }

    setDirLight(dirLight) {
        this.dirLight = dirLight;
    }

    draw() {
        this.camera.update();
        this.nodes.forEach(element => element.draw(this.camera.getPVMatrix(), this.dirLight.getLightDirection()));
    }
}