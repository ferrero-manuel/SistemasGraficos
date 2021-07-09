class Camera {
    constructor(eye_position, focal_point, up_axis, projectionMatrix) {
        this.eye_position = vec3.clone(eye_position);
        this.focal_point = vec3.clone(focal_point);
        this.up_axis = vec3.clone(up_axis);
        this.viewMatrix = mat4.create();
        mat4.lookAt(this.viewMatrix, eye_position, focal_point, up_axis);
        this.projectionMatrix = mat4.clone(projectionMatrix);
        
        this.PV_Matrix = mat4.create();
        mat4.multiply(this.PV_Matrix, this.projectionMatrix, this.viewMatrix);

        this.rotation = vec3.create();
    }

    // setViewMatrix(viewMatrix) {
    //     mat4.copy(this.viewMatrix, viewMatrix);
    //     mat4.multiply(this.PV_Matrix, this.projectionMatrix, this.viewMatrix);
    // }

    setProjectionMatrix(projectionMatrix) {
        mat4.copy(this.projectionMatrix, projectionMatrix);
        mat4.multiply(this.PV_Matrix, this.projectionMatrix, this.viewMatrix);
    }

    getPVMatrix() {
        return this.PV_Matrix;
    }

    move(dx, dy, dz) {
        this.eye_position[0] += dx; // Truck.
        this.focal_point[0] += dx;
        this.eye_position[1] += dy; // Pedesta.
        this.focal_point[1] += dy;
        this.eye_position[2] += dz; // Dolly.
        this.focal_point[2] += dz;
        mat4.lookAt(this.viewMatrix, this.eye_position, this.focal_point, this.up_axis);
        mat4.multiply(this.PV_Matrix, this.projectionMatrix, this.viewMatrix);
    }

    rotateX(dx) {
        vec3.rotateX(this.focal_point, this.focal_point, this.eye_position, dx);
        mat4.lookAt(this.viewMatrix, this.eye_position, this.focal_point, this.up_axis);
        mat4.multiply(this.PV_Matrix, this.projectionMatrix, this.viewMatrix);
    }

    rotateY(dy) { // limitar en los extremos
        vec3.rotateY(this.focal_point, this.focal_point, this.eye_position, dy);
        mat4.lookAt(this.viewMatrix, this.eye_position, this.focal_point, this.up_axis);
        mat4.multiply(this.PV_Matrix, this.projectionMatrix, this.viewMatrix);
    }

    rotateZ(dz) {
        vec3.rotateZ(this.up_axis, this.up_axis, [0, 0, 0], dz);
        mat4.lookAt(this.viewMatrix, this.eye_position, this.focal_point, this.up_axis);
        mat4.multiply(this.PV_Matrix, this.projectionMatrix, this.viewMatrix);
    }

    orbital(dx, dy) { // Limitar los valores en los extremos.
        console.log(this.eye_position);
        vec3.rotateY(this.eye_position, this.eye_position, this.focal_point, dx);
        vec3.rotateX(this.eye_position, this.eye_position, this.focal_point, dy);
        console.log(this.eye_position);
        mat4.lookAt(this.viewMatrix, this.eye_position, this.focal_point, this.up_axis);
        mat4.multiply(this.PV_Matrix, this.projectionMatrix, this.viewMatrix);
    }

    getPosition() {
        let out = vec3.create();
        vec3.sub(out, this.eye_position, this.focal_point);
        // return vec3.clone(this.eye_position);
        return out;
    }
}

// para ver como calcular ángulos ver TP's viejos.
class OrbitalCamera {
    constructor(eye_position, focal_point, projectionMatrix) {
        this.projectionMatrix = mat4.clone(projectionMatrix);
        this.PV_Matrix = mat4.create();

        this.eye_position = vec3.clone(eye_position);
        this.focal_point = vec3.clone(focal_point);
        this.up_axis = [0, 1, 0];
        this.viewMatrix = mat4.create();
        mat4.lookAt(this.viewMatrix, eye_position, focal_point, this.up_axis);

        this.old = {x: 0, y: 0};
        this.azimuth = 2; // en x.
        this.colatitude = 1; // en y.
        this.velocity = 1;
        this.radio = 50;
        this.delta_radio = 1;

        this.update();

        // mat4.multiply(this.PV_Matrix, this.projectionMatrix, this.viewMatrix);
    }

    fixInitMovePosition(event) {
        this.old.x = event.pageX;
        this.old.y = event.pageY;
    }

    zoom(event) {
        if (event.deltaY > 0) {
            this.radio += this.delta_radio;
        }
    
        if (event.deltaY < 0) {
            this.radio -= this.delta_radio;
            
            if (this.radio < 20) {
                this.radio = 20;
            }
        }
    
        this.update();
    }

    move(event) {
        let dX = (event.pageX - this.old.x)*2*Math.PI/canvas.width;
        let dY = (event.pageY - this.old.y)*2*Math.PI/canvas.height;

        this.old.x = event.pageX;
        this.old.y = event.pageY;
        
        this.azimuth += dX*this.velocity;
        this.colatitude += dY*this.velocity;

        // Cota
        if (this.colatitude >= 0.45*Math.PI) {
            this.colatitude = 0.45*Math.PI;
        } else if (this.colatitude < 0.1) {
            this.colatitude = 0.1;
        }

        this.update();
    }

    update() {
        let x = this.radio * Math.sin((this.colatitude)) * Math.cos((this.azimuth));
		let y = this.radio * Math.cos((this.colatitude));
		let z = this.radio * Math.sin((this.colatitude)) * Math.sin((this.azimuth));
		this.eye_position = [x, y, z];
        mat4.lookAt(this.viewMatrix, this.eye_position, this.focal_point, this.up_axis);
        mat4.multiply(this.PV_Matrix, this.projectionMatrix, this.viewMatrix);
    }

    setProjectionMatrix(projectionMatrix) {
        mat4.copy(this.projectionMatrix, projectionMatrix);
        mat4.multiply(this.PV_Matrix, this.projectionMatrix, this.viewMatrix);
    }

    getPVMatrix() {
        return this.PV_Matrix;
    }


    getPosition() {
        let out = vec3.create();
        vec3.sub(out, this.eye_position, this.focal_point);
        // return vec3.clone(this.eye_position);
        return out;
    }
}


class ObjectCamera {
    constructor(viewMatrix, projectionMatrix) {
        this.viewMatrix = mat4.clone(viewMatrix);
        this.projectionMatrix = mat4.clone(projectionMatrix);

        this.PV_Matrix = mat4.create();
        mat4.multiply(this.PV_Matrix, this.projectionMatrix, this.viewMatrix);
        
        this.viewDirection = vec3.create();
        this.viewDirection[0] = this.viewMatrix[2];
        this.viewDirection[1] = this.viewMatrix[6];
        this.viewDirection[3] = this.viewMatrix[10];
    }

    changePosition(worldMatrix) {
        mat4.invert(this.viewMatrix, worldMatrix);
        mat4.multiply(this.PV_Matrix, this.projectionMatrix, this.viewMatrix);
        
        // let q4 = quat.create();
        // mat4.getRotation(q4, this.viewMatrix);
        // vec3.transformQuat(this.viewDirection, [0, 0, 1], q4);
        this.viewDirection[0] = this.viewMatrix[2];
        this.viewDirection[1] = this.viewMatrix[6];
        this.viewDirection[3] = this.viewMatrix[10];
        
        // // let mod = [0, 0, 0];
        // this.viewMatrix = viewMatrix;
        // mat4.getTranslation(this.translation, viewMatrix);
        // vec3.subtract(mod, mod, this.translation);
        // mat4.translate(this.viewMatrix, viewMatrix, mod);
        // vec3.transformMat4(, [0, 0, 1], this.viewMatrix)
        // vec3.subtract(mod, mod, this.translation);
        // mat4.translate(this.viewMatrix, viewMatrix, mod);
        // // this.viewMatrix = mat4.clone(viewMatrix);
        // mat4.multiply(this.PV_Matrix, this.projectionMatrix, this.viewMatrix);
    }

    getPVMatrix() {
        return this.PV_Matrix;
    }

    getPosition() {
        return this.viewDirection;
    }
}