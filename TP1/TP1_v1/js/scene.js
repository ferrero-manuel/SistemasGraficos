class glScene {
    constructor() {
        this.nodes = [];
        this.camera = [];
    }

    addNode(node) {
        this.nodes.push(node);
    }

    setCamera(camera) {
        this.camera = camera;
    }

    draw(out) {
        this.nodes.forEach(element => element.draw(this.camera.getPVMatrix(), this.camera.getPosition()));
    }
}