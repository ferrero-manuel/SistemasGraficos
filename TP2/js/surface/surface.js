//==============================================================================
class Surface {
    constructor(parametric, rows, cols) {
        this.parametric = parametric;
        this.rows = rows;
        this.cols = cols;
        this.vertexBuffer = [];
        this.normalBuffer = [];
        this.uvBuffer = [];
        this.indexBuffer = [];

        this.glDrawMode = gl.TRIANGLE_STRIP;
        this.color = [0.5, 0.5, 0.5, 1];

        this.generate();
    }

    generate() {
        let u, v, positions, normals, uvs;
        for (let i = 0; i <= this.rows; i++) {
            v = i/this.rows;

            for (let j = 0; j <= this.cols; j++) {
                u = j/this.cols;

                positions = this.parametric.getPosition(u, v);
                this.vertexBuffer.push(positions[0]);
                this.vertexBuffer.push(positions[1]);
                this.vertexBuffer.push(positions[2]);

                normals = this.parametric.getNormal(u, v);
                this.normalBuffer.push(normals[0]);
                this.normalBuffer.push(normals[1]);
                this.normalBuffer.push(normals[2]);

                uvs = this.parametric.getTextureCoordinates(u, v);
                this.uvBuffer.push(uvs[0]);
                this.uvBuffer.push(uvs[1]);
            }
        }

        for (let i = 0; i < this.rows; i++) {
            this.indexBuffer.push(i*(this.cols + 1));
    
            for (let j = 0; j <= this.cols; j++) {
                this.indexBuffer.push(i*(this.cols + 1) + j);
                this.indexBuffer.push((i+1)*(this.cols + 1) + j);            
            }
            this.indexBuffer.push((i + 1)*(this.cols + 1) + this.cols);
        }
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

//==============================================================================