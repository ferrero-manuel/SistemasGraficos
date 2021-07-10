class Cabin {
    constructor() {
        this.aCube = new Cube();

        this.principalNode = new Node()

        this.node1 = new Node();
        this.node1.setShaderProgram(shaderProgram); // pasar el shader
        this.node1.setParent(this.principalNode);
        this.node1.setGeometry(this.aCube);
        this.node1.setScale(3, 0.1, 3);
        this.node1.setPosition(0, -1.5, 0);

        this.node2 = new Node();
        this.node2.setShaderProgram(shaderProgram);
        this.node2.setParent(this.principalNode);
        this.node2.setGeometry(this.aCube);
        this.node2.setScale(3, 0.1, 3);
        this.node2.setPosition(0, 1.5, 0);

        this.node3 = new Node();
        this.node3.setShaderProgram(shaderProgram);
        this.node3.setGeometry(this.aCube);
        this.node3.setParent(this.principalNode);
        this.node3.setScale(3, 3, 0.1);
        this.node3.setPosition(0, 0, 1.5);

        this.node4 = new Node();
        this.node4.setShaderProgram(shaderProgram);
        this.node4.setGeometry(this.aCube);
        this.node4.setParent(this.principalNode);
        this.node4.setScale(3, 0.75, 0.1);
        this.node4.setPosition(0, -1.5 + 0.375, -1.5);

        this.node5 = new Node();
        this.node5.setShaderProgram(shaderProgram);
        this.node5.setGeometry(this.aCube);
        this.node5.setParent(this.principalNode);
        this.node5.setScale(0.1, 3, 1.5);
        this.node5.setPosition(-1.5, 0, 0.75);

        this.node6 = new Node();
        this.node6.setShaderProgram(shaderProgram);
        this.node6.setGeometry(this.aCube);
        this.node6.setParent(this.principalNode);
        this.node6.setScale(0.1, 3, 1.5);
        this.node6.setPosition(1.5, 0, 0.75);

        this.node7 = new Node();
        this.node7.setShaderProgram(shaderProgram);
        this.node7.setGeometry(this.aCube);
        this.node7.setParent(this.principalNode);
        this.node7.setScale(0.1, 0.75, 1.5);
        this.node7.setPosition(1.5, -1.5 + 0.375, -0.75);

        this.node8 = new Node();
        this.node8.setShaderProgram(shaderProgram);
        this.node8.setGeometry(this.aCube);
        this.node8.setParent(this.principalNode);
        this.node8.setScale(0.1, 0.75, 1.5);
        this.node8.setPosition(-1.5, -1.5 + 0.375, -0.75);
    }

    setPosition(x, y, z) {
        this.principalNode.setPosition(x, y, z);
    }

    getNode() {
        return this.principalNode; 
    }
}