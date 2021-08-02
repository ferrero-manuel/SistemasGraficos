class Node {
    constructor() {
        this.geometry = null;
        this.vertexBuffer;
        this.normalBuffer;
        this.color;
        this.indexBuffer;
        this.uvBuffer;
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

        this.cameraPosition = vec3.create();
        this.IVMatrix = mat4.create();

        this.glDrawMode;

        this.shaderManipulator = [];
        this.textures = [];
    }

    setShaderProgram(shaderProgram) {
        this.shaderProgram = shaderProgram;
        this.shaderManipulator = new shaderManipulatorBasic(shaderProgram, this);
    }

    setShaderProgramTexture(shaderProgram, textures, numTexture) {
        this.shaderProgram = shaderProgram;
        this.textures = textures;
        this.shaderManipulator = new shaderManipulatorTexture(shaderProgram, textures, numTexture, this);
    }

    setShaderProgramTerrain(shaderProgram, textures, numTexture) {
        this.shaderProgram = shaderProgram;
        this.shaderManipulator = new shaderManipulatorTerrain(shaderProgram, textures, numTexture, this);
    }

    setShaderProgramCubeMap(shaderProgram, cubeMap) {
        this.shaderProgram = shaderProgram;
        this.shaderManipulator = new shaderManipulatorCubeMap(shaderProgram, cubeMap.getTexture(), this);
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

        if (this.geometry.hasOwnProperty('uvBuffer')) {
            this.uvBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.geometry.getuvBuffer()), gl.STATIC_DRAW);   
        }
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

    draw(PVM_Matrix, dirLight) {
        if (this.geometry) {
            this.shaderManipulator.execute(PVM_Matrix, dirLight);
        }

        this.children.forEach(element => {
            element.setCameraPosition(this.cameraPosition);
            element.draw(PVM_Matrix, dirLight);
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

        // También se actualiza la matriz que rota las normales para la iluminación.
        mat4.invert(this.IVMatrix, this.worldMatrix);
        mat4.transpose(this.IVMatrix, this.IVMatrix);

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

    setCameraPosition(position) {
        this.cameraPosition = position;
    }
}