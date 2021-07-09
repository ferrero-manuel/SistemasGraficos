class Node {
    constructor() {
        this.geometry = null;
        this.vertexBuffer;
        this.normalBuffer;
        this.color;
        this.indexBuffer;
        this.shaderProgram;
        this.parent = null;
        this.children = [];
        this.position = vec3.create(); // Posición del nodo.
        this.rotation = vec3.create(); // Rotación en grados sobre cada eje.
        this.quatRotation = quat.create(); // Quaternión auxiliar para las rotaciones.
        this.scale = vec3.clone([1, 1, 1]); // Escala del objeto.
        this.localMatrix = mat4.create(); // Matriz del objeto con respecto al padre.
        this.worldMatrix = mat4.create(); // Matriz del objeto con respecto al mundo.
        this.applyMatrix = mat4.create(); // No incluye escalados.

        this.glDrawMode;
    }

    setShaderProgram(shaderProgram) {
        this.shaderProgram = shaderProgram;
    }

    setGeometry(geometry) {
        this.geometry = geometry;
        this.color = geometry.getColor();
        this.glDrawMode = this.geometry.getDrawMode();

        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.geometry.getVertexBuffer()), gl.STATIC_DRAW);
        this.normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.geometry.getNormalBuffer()), gl.STATIC_DRAW);
        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.geometry.getIndexBuffer()), gl.STATIC_DRAW);
    }

    setParent(parent) {
        if (this === parent) {
            console.error("No puedo ser mi propio padre.")
        }

        if (this.parent) {
            let ndx = this.parent.children.indexOf(this);
            if (ndx >= 0) {
                this.parent.children.splice(ndx, 1);
            }
        }

        if (parent) {
            parent.children.push(this);
        }

        this.parent = parent;

        this._updateWorldMatrix();
    }

    draw(PVM_Matrix, _eye) {
        if (this.geometry) {
            gl.useProgram(this.shaderProgram); // Usar shader del nod.

            let _position = gl.getAttribLocation(this.shaderProgram, "position");
            gl.enableVertexAttribArray(_position);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            gl.vertexAttribPointer(_position, 3, gl.FLOAT, false, 0, 0);

            let _normal = gl.getAttribLocation(this.shaderProgram, "normal");
            gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
            gl.enableVertexAttribArray(_normal);
            gl.vertexAttribPointer(_normal, 3, gl.FLOAT, false, 0, 0);

            let _PVM_Matrix = gl.getUniformLocation(this.shaderProgram, "PVMmatrix");
            gl.uniformMatrix4fv(_PVM_Matrix, false, PVM_Matrix);
            
            let _modelMatrix = gl.getUniformLocation(this.shaderProgram, "Model_Matrix");
            gl.uniformMatrix4fv(_modelMatrix, false, this.applyMatrix);

            let colorLocation = gl.getUniformLocation(this.shaderProgram, "u_color");
            gl.uniform4fv(colorLocation, this.color); // green

            let reverseLightDirectionLocation = gl.getUniformLocation(this.shaderProgram, "u_reverseLightDirection");
            let normal_dir = vec3.clone(_eye);
            vec3.normalize(normal_dir, normal_dir);           
            gl.uniform3fv(reverseLightDirectionLocation, normal_dir);

            let worldInvTransposeLoc = gl.getUniformLocation(this.shaderProgram, "u_worldInverseTranspose");
            let IVMatrix = mat4.create();
            mat4.invert(IVMatrix, this.worldMatrix);
            mat4.transpose(IVMatrix, IVMatrix);
            gl.uniformMatrix4fv(worldInvTransposeLoc, false, IVMatrix);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            gl.drawElements(this.glDrawMode, this.geometry.getIndexLength(), gl.UNSIGNED_SHORT, 0);
        }

        this.children.forEach(function(child) {
            child.draw(PVM_Matrix, _eye);
        });
    }

    _updateWorldMatrix() {
        // Calcular matriz de mundo del objeto.
        if (this.parent) {
            mat4.multiply(this.worldMatrix, this.parent.worldMatrix, this.localMatrix);
        } else {
            mat4.copy(this.worldMatrix, this.localMatrix);
        }

        // Cada vez que se actualiza la matriz de mundo tambíen se actualiza la matriz a aplicar.
        mat4.scale(this.applyMatrix, this.worldMatrix, this.scale);

        // Para cada hijo actualizar la matriz de mundo.
        this.children.forEach(function(child) {
            child._updateWorldMatrix();
        });
    }

    setPosition(x, y, z) {
        this.position = vec3.fromValues(x, y, z);
        mat4.fromRotationTranslation(this.localMatrix, this.quatRotation, this.position);
        this._updateWorldMatrix();
        mat4.scale(this.applyMatrix, this.worldMatrix, this.scale);
    }

    setScale(x, y, z) {
        this.scale = vec3.fromValues(x, y, z);
        this._updateWorldMatrix();
        mat4.scale(this.applyMatrix, this.worldMatrix, this.scale);
    }

    setRotation(x, y, z) {
        this.rotation = vec3.fromValues(x, y, z);
        quat.fromEuler(this.quatRotation, x, y, z);
        mat4.fromRotationTranslation(this.localMatrix, this.quatRotation, this.position);
        this._updateWorldMatrix();
        mat4.scale(this.applyMatrix, this.worldMatrix, this.scale);
    }
}