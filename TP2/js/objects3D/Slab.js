class Slab {
    constructor() {      
        this.color = [0.5, 0.5, 0.5, 1];
        this.glDrawMode = gl.TRIANGLE_STRIP;

        this.vertexBuffer = [];
        this.normalBuffer = [];
        this.indexBuffer = [];
        this.uvBuffer = [];
    }
 
    build(aDiscretizer, p) {
        let tempVertexBuffer = aDiscretizer.getCurve(p);
        this.vertexBuffer.push(0, 0, 0);
        this.uvBuffer.push(0, 0);
        this.normalBuffer.push(0, -1, 0);
        
        for (let i = 0; i < tempVertexBuffer.length; i++) {
            this.vertexBuffer.push(tempVertexBuffer[i][0], tempVertexBuffer[i][1], tempVertexBuffer[i][2]);
            this.uvBuffer.push(tempVertexBuffer[i][0]/4, tempVertexBuffer[i][2]/4);
            this.normalBuffer.push(0, -1, 0);
        }

        for (let i = 1; i < tempVertexBuffer.length; i++) {
            this.indexBuffer.push(0, i, i + 1);
        }
        this.indexBuffer.push(0, tempVertexBuffer.length, 1); //HASTA ACA BIEN

        let tempNormalBuffer = aDiscretizer.getNormal(p);
        for (let i = 0; i < tempVertexBuffer.length; i++) {
            this.vertexBuffer.push(tempVertexBuffer[i][0], tempVertexBuffer[i][1], tempVertexBuffer[i][2]);
            this.uvBuffer.push(tempVertexBuffer[i][0]/4, tempVertexBuffer[i][2]/4);
            this.normalBuffer.push(tempNormalBuffer[i][0], tempNormalBuffer[i][1], tempNormalBuffer[i][2]);
        }

        for (let i = 0; i < tempVertexBuffer.length; i++) {
            this.vertexBuffer.push(tempVertexBuffer[i][0], 0.5, tempVertexBuffer[i][2]);
            this.uvBuffer.push(tempVertexBuffer[i][0]/4, tempVertexBuffer[i][2]/4);
            this.normalBuffer.push(tempNormalBuffer[i][0], tempNormalBuffer[i][1], tempNormalBuffer[i][2]);
        }

        let cols = p - 1;
        let rows = 1;
        for (let i = 0; i < rows; i++) {
            this.indexBuffer.push(101+i*(cols+1));
    
            for (let j = 0; j <= cols; j++) {
                this.indexBuffer.push(p + 1 + i*(cols + 1) + j);
                this.indexBuffer.push(p + 1 + (i + 1)*(cols + 1) + j);            
            }
            this.indexBuffer.push(p + 1 + (i + 1)*(cols + 1) + cols);
        }

        for (let i = 0; i < tempVertexBuffer.length; i++) {
            this.vertexBuffer.push(tempVertexBuffer[i][0], 0.5, tempVertexBuffer[i][2]);
            this.uvBuffer.push(tempVertexBuffer[i][0]/4, tempVertexBuffer[i][2]/4);
            this.normalBuffer.push(0, 1, 0);
        }

        this.vertexBuffer.push(0, 1, 0);
        this.uvBuffer.push(0, 0);
        this.normalBuffer.push(0, 1, 0);

        for (let i = 300; i < 300 + tempVertexBuffer.length; i++) {
            this.indexBuffer.push(401, i, i + 1);
        }
        this.indexBuffer.push(401); //HASTA ACA BIEN
    }

    getVertexBuffer() {
        return this.vertexBuffer;
    }

    getNormalBuffer() {
        return this.normalBuffer;
    }

    getuvBuffer() {
        return this.uvBuffer;
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