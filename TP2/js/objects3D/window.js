class Window {
    constructor() {
        this.glDrawMode = gl.TRIANGLES;
        this.color = [0.5, 0.5, 0.5, 1];

        this.vertexBuffer = [
            -0.5, -0.5, 0.0, -0.5, 0.5, 0.0, 0.5, -0.5, 0.0, 0.5, 0.5, 0.0
        ];

        this.normalBuffer = [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1];

        this.indexBuffer = [0, 1, 2, 1, 2, 3];

        this.uvBuffer = [0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0];
    }

    getVertexBuffer() {
        return this.vertexBuffer;
    }

    getNormalBuffer() {
        return this.normalBuffer;
    }

    getIndexBuffer() {
        return this.indexBuffer;
    }

    getIndexLength() {
        return this.indexBuffer.length;
    }

    getuvBuffer() {
        return this.uvBuffer;
    }

    getColor() {
        return this.color;
    }

    getDrawMode() {
        return this.glDrawMode;
    }
}