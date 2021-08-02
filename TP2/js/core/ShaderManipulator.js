//==============================================================================
class shaderManipulatorBasic {
    constructor(shaderProgram, node) {
        this.shaderProgram = shaderProgram;
        this.node = node;

        this.a_position_location = gl.getAttribLocation(this.shaderProgram, "a_position");
        this.a_normal_location = gl.getAttribLocation(this.shaderProgram, "a_normal");

        this.u_model_matrix_location = gl.getUniformLocation(this.shaderProgram, "u_model_matrix");
        this.u_PV_matrix_location = gl.getUniformLocation(this.shaderProgram, "u_PV_matrix");
        this.u_world_inv_transpose_location =
            gl.getUniformLocation(this.shaderProgram, "u_world_inv_transpose");

        this.u_color_location = gl.getUniformLocation(this.shaderProgram, "u_color");
        this.u_reverse_light_dir_location =
            gl.getUniformLocation(this.shaderProgram, "u_reverse_light_dir");
    }

    execute(PV_Matrix, dirLight) {
        gl.useProgram(this.shaderProgram);

        gl.enableVertexAttribArray(this.a_position_location);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.node.vertexBuffer);
        gl.vertexAttribPointer(this.a_position_location, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.node.normalBuffer);
        gl.enableVertexAttribArray(this.a_normal_location);
        gl.vertexAttribPointer(this.a_normal_location, 3, gl.FLOAT, false, 0, 0);

        gl.uniformMatrix4fv(this.u_model_matrix_location, false, this.node.applyMatrix);
        gl.uniformMatrix4fv(this.u_PV_matrix_location, false, PV_Matrix);
        gl.uniformMatrix4fv(this.u_world_inv_transpose_location, false, this.node.IVMatrix);
        
        gl.uniform4fv(this.u_color_location, this.node.color);
        gl.uniform3fv(this.u_reverse_light_dir_location, dirLight);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.node.indexBuffer);
        gl.drawElements(this.node.glDrawMode, this.node.geometry.getIndexLength(), gl.UNSIGNED_SHORT, 0);
    }
}

//==============================================================================
class shaderManipulatorTexture {
    constructor(shaderProgram, textures, numTexture, node) {
        this.shaderProgram = shaderProgram;
        this.textures = textures;
        this.numTexture = numTexture;
        this.node = node;

        this.a_position_location = gl.getAttribLocation(this.shaderProgram, "a_position");
        this.a_normal_location = gl.getAttribLocation(this.shaderProgram, "a_normal");
        this.a_texcoord_location = gl.getAttribLocation(this.shaderProgram, "a_texcoord");

        this.u_model_matrix_location = gl.getUniformLocation(this.shaderProgram, "u_model_matrix");
        this.u_PV_matrix_location = gl.getUniformLocation(this.shaderProgram, "u_PV_matrix");
        this.u_world_inv_transpose_location =
            gl.getUniformLocation(this.shaderProgram, "u_world_inv_transpose");

        this.u_color_location = gl.getUniformLocation(this.shaderProgram, "u_color");
        this.u_reverse_light_dir_location =
            gl.getUniformLocation(this.shaderProgram, "u_reverse_light_dir");
        this.u_texture_location = gl.getUniformLocation(this.shaderProgram, "u_texture");
    }

    execute(PV_Matrix, dirLight) {
        gl.useProgram(this.shaderProgram);

        gl.enableVertexAttribArray(this.a_position_location);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.node.vertexBuffer);
        gl.vertexAttribPointer(this.a_position_location, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.node.normalBuffer);
        gl.enableVertexAttribArray(this.a_normal_location);
        gl.vertexAttribPointer(this.a_normal_location, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.node.uvBuffer);
        gl.enableVertexAttribArray(this.a_texcoord_location);
        gl.vertexAttribPointer(this.a_texcoord_location, 2, gl.FLOAT, false, 0, 0);

        gl.uniformMatrix4fv(this.u_model_matrix_location, false, this.node.applyMatrix);
        gl.uniformMatrix4fv(this.u_PV_matrix_location, false, PV_Matrix);
        gl.uniformMatrix4fv(this.u_world_inv_transpose_location, false, this.node.IVMatrix);
        
        gl.uniform4fv(this.u_color_location, this.node.color);
        gl.uniform3fv(this.u_reverse_light_dir_location, dirLight);

        gl.uniform1i(this.u_texture_location, 0); //
        gl.activeTexture(gl.TEXTURE0); //
        gl.bindTexture(gl.TEXTURE_2D, this.textures[this.numTexture]);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.node.indexBuffer);
        gl.drawElements(this.node.glDrawMode, this.node.geometry.getIndexLength(), gl.UNSIGNED_SHORT, 0);
    }
}

//==============================================================================
class shaderManipulatorTerrain {
    constructor(shaderProgram, textures, numTexture, node) {
        this.shaderProgram = shaderProgram;
        this.textures = textures;
        this.numTexture = numTexture;
        this.node = node;

        this.a_position_location = gl.getAttribLocation(this.shaderProgram, "a_position");
        this.a_normal_location = gl.getAttribLocation(this.shaderProgram, "a_normal");
        this.a_texcoord_location = gl.getAttribLocation(this.shaderProgram, "a_texcoord");

        this.u_model_matrix_location = gl.getUniformLocation(this.shaderProgram, "u_model_matrix");
        this.u_PVM_matrix_location = gl.getUniformLocation(this.shaderProgram, "u_PV_matrix");
        this.u_world_inv_transpose_location =
            gl.getUniformLocation(this.shaderProgram, "u_world_inv_transpose");

        this.u_color_location = gl.getUniformLocation(this.shaderProgram, "u_color");
        this.u_reverse_light_dir_location =
            gl.getUniformLocation(this.shaderProgram, "u_reverse_light_dir");
        this.u_texture_0_location = gl.getUniformLocation(this.shaderProgram, "u_texture_0");
        this.u_texture_1_location = gl.getUniformLocation(this.shaderProgram, "u_texture_1");
        this.u_texture_2_location = gl.getUniformLocation(this.shaderProgram, "u_texture_2");
    }

    execute(PV_Matrix, dirLight) {
        gl.useProgram(this.shaderProgram);

        gl.enableVertexAttribArray(this.a_position_location);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.node.vertexBuffer);
        gl.vertexAttribPointer(this.a_position_location, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.node.normalBuffer);
        gl.enableVertexAttribArray(this.a_normal_location);
        gl.vertexAttribPointer(this.a_normal_location, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.node.uvBuffer);
        gl.enableVertexAttribArray(this.a_texcoord_location);
        gl.vertexAttribPointer(this.a_texcoord_location, 2, gl.FLOAT, false, 0, 0);

        gl.uniformMatrix4fv(this.u_model_matrix_location, false, this.node.applyMatrix);
        gl.uniformMatrix4fv(this.u_PVM_matrix_location, false, PV_Matrix);       
        gl.uniformMatrix4fv(this.u_world_inv_transpose_location, false, this.node.IVMatrix);

        gl.uniform4fv(this.u_color_location, this.node.color);
        gl.uniform3fv(this.u_reverse_light_dir_location, dirLight);

        gl.uniform1i(this.u_texture_0_location, this.numTexture[0]);
        gl.activeTexture(gl.TEXTURE0 + this.numTexture[0]);
        gl.bindTexture(gl.TEXTURE_2D, this.textures[this.numTexture[0]]);
        gl.uniform1i(this.u_texture_1_location, this.numTexture[1]);
        gl.activeTexture(gl.TEXTURE0 + this.numTexture[1]);
        gl.bindTexture(gl.TEXTURE_2D, this.textures[this.numTexture[1]]);
        gl.uniform1i(this.u_texture_2_location, this.numTexture[2]);
        gl.activeTexture(gl.TEXTURE0 + this.numTexture[2]);
        gl.bindTexture(gl.TEXTURE_2D, this.textures[this.numTexture[2]]);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.node.indexBuffer);
        gl.drawElements(this.node.glDrawMode, this.node.geometry.getIndexLength(), gl.UNSIGNED_SHORT, 0);
    }
}

//==============================================================================
class shaderManipulatorCubeMap {
    constructor(shaderProgram, texture, node) {
        this.shaderProgram = shaderProgram;
        this.texture = texture;
        this.node = node;

        this.a_position_location = gl.getAttribLocation(this.shaderProgram, "a_position");
        this.a_normal_location = gl.getAttribLocation(this.shaderProgram, "a_normal");

        this.u_model_matrix_location = gl.getUniformLocation(this.shaderProgram, "u_model_matrix");
        this.u_PVM_matrix_location = gl.getUniformLocation(this.shaderProgram, "u_PV_matrix");
        this.u_world_inv_transpose_location =
            gl.getUniformLocation(this.shaderProgram, "u_world_inv_transpose");
        
        this.u_world_cam_pos_location = gl.getUniformLocation(this.shaderProgram, "u_worldCameraPosition");
        this.u_texture_location = gl.getUniformLocation(this.shaderProgram, "u_texture");
    }

    execute(PV_Matrix, dirLight) {
        gl.useProgram(this.shaderProgram);

        gl.enableVertexAttribArray(this.a_position_location);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.node.vertexBuffer);
        gl.vertexAttribPointer(this.a_position_location, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.node.normalBuffer);
        gl.enableVertexAttribArray(this.a_normal_location);
        gl.vertexAttribPointer(this.a_normal_location, 3, gl.FLOAT, false, 0, 0);

        gl.uniformMatrix4fv(this.u_model_matrix_location, false, this.node.applyMatrix);
        gl.uniformMatrix4fv(this.u_PVM_matrix_location, false, PV_Matrix);
        gl.uniformMatrix4fv(this.u_world_inv_transpose_location, false, this.node.IVMatrix);

        gl.uniform3fv(this.u_world_cam_pos_location, this.node.cameraPosition);

        gl.uniform1i(this.u_texture_location, 0);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.node.indexBuffer);
        gl.drawElements(this.node.glDrawMode, this.node.geometry.getIndexLength(), gl.UNSIGNED_SHORT, 0);
    }
}

//==============================================================================