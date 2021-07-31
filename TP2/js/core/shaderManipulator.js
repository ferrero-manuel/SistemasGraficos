class shaderManipulatorBasic {
    constructor(shaderProgram, node) {
        this.shaderProgram = shaderProgram;
        this.node = node;
    }

    execute(PVM_Matrix, dirLight) {
        gl.useProgram(this.shaderProgram); // Usar shader del nod.

        let _position = gl.getAttribLocation(this.shaderProgram, "position");
        gl.enableVertexAttribArray(_position);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.node.vertexBuffer);
        gl.vertexAttribPointer(_position, 3, gl.FLOAT, false, 0, 0);

        let _normal = gl.getAttribLocation(this.shaderProgram, "normal");
        gl.bindBuffer(gl.ARRAY_BUFFER, this.node.normalBuffer);
        gl.enableVertexAttribArray(_normal);
        gl.vertexAttribPointer(_normal, 3, gl.FLOAT, false, 0, 0);

        let _PVM_Matrix = gl.getUniformLocation(this.shaderProgram, "PVMmatrix");
        gl.uniformMatrix4fv(_PVM_Matrix, false, PVM_Matrix);
        
        let _modelMatrix = gl.getUniformLocation(this.shaderProgram, "Model_Matrix");
        gl.uniformMatrix4fv(_modelMatrix, false, this.node.applyMatrix);

        let colorLocation = gl.getUniformLocation(this.shaderProgram, "u_color");
        gl.uniform4fv(colorLocation, this.node.color); // green

        let reverseLightDirectionLocation = gl.getUniformLocation(this.shaderProgram, "u_reverseLightDirection");       
        gl.uniform3fv(reverseLightDirectionLocation, dirLight);

        let worldInvTransposeLoc = gl.getUniformLocation(this.shaderProgram, "u_worldInverseTranspose");
        gl.uniformMatrix4fv(worldInvTransposeLoc, false, this.node.IVMatrix);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.node.indexBuffer);
        gl.drawElements(this.node.glDrawMode, this.node.geometry.getIndexLength(), gl.UNSIGNED_SHORT, 0);
    }
}

class shaderManipulatorTexture {
    constructor(shaderProgram, textures, numTexture, node) {
        this.shaderProgram = shaderProgram;
        this.textures = textures;
        this.numTexture = numTexture;
        this.node = node;
    }

    execute(PVM_Matrix, dirLight) {
        gl.useProgram(this.shaderProgram); // Usar shader del nod.

        let _position = gl.getAttribLocation(this.shaderProgram, "position");
        gl.enableVertexAttribArray(_position);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.node.vertexBuffer);
        gl.vertexAttribPointer(_position, 3, gl.FLOAT, false, 0, 0);

        let _normal = gl.getAttribLocation(this.shaderProgram, "normal");
        gl.bindBuffer(gl.ARRAY_BUFFER, this.node.normalBuffer);
        gl.enableVertexAttribArray(_normal);
        gl.vertexAttribPointer(_normal, 3, gl.FLOAT, false, 0, 0);

        let _a_texcoord = gl.getAttribLocation(this.shaderProgram, "a_texcoord");
        gl.bindBuffer(gl.ARRAY_BUFFER, this.node.uvBuffer);
        gl.enableVertexAttribArray(_a_texcoord);
        gl.vertexAttribPointer(_a_texcoord, 2, gl.FLOAT, false, 0, 0);

        let u_textureLocation = gl.getUniformLocation(this.shaderProgram, "u_texture");
        gl.uniform1i(u_textureLocation, this.numTexture);
        gl.activeTexture(gl.TEXTURE0 + this.numTexture);
        gl.bindTexture(gl.TEXTURE_2D, this.textures[this.numTexture]);

        let _PVM_Matrix = gl.getUniformLocation(this.shaderProgram, "PVMmatrix");
        gl.uniformMatrix4fv(_PVM_Matrix, false, PVM_Matrix);
        
        let _modelMatrix = gl.getUniformLocation(this.shaderProgram, "Model_Matrix");
        gl.uniformMatrix4fv(_modelMatrix, false, this.node.applyMatrix);

        let colorLocation = gl.getUniformLocation(this.shaderProgram, "u_color");
        gl.uniform4fv(colorLocation, this.node.color); // green

        let reverseLightDirectionLocation = gl.getUniformLocation(this.shaderProgram, "u_reverseLightDirection");       
        gl.uniform3fv(reverseLightDirectionLocation, dirLight);

        let worldInvTransposeLoc = gl.getUniformLocation(this.shaderProgram, "u_worldInverseTranspose");
        gl.uniformMatrix4fv(worldInvTransposeLoc, false, this.node.IVMatrix);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.node.indexBuffer);
        gl.drawElements(this.node.glDrawMode, this.node.geometry.getIndexLength(), gl.UNSIGNED_SHORT, 0);
    }
}