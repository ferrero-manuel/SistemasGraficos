class Terrain {
    constructor() {
        this.glDrawMode = gl.TRIANGLES;
        this.color = [176/255.0, 188/255.0, 148/255.0, 1];

        this.vertexBuffer = [
            -100, 0, -100, -100, 0, 100, 100, 0, -100, 100, 0, 100
        ];

        this.normalBuffer = [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0];

        this.indexBuffer = [0, 1, 2, 1, 2, 3];
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

    getColor() {
        return this.color;
    }

    getDrawMode() {
        return this.glDrawMode;
    }
}