//==============================================================================
class DroneCamera {
    constructor(initialPos, projectionMatrix) {
        this.initialPos = initialPos;
        this.projectionMatrix = mat4.clone(projectionMatrix);
        this.PV_Matrix = mat4.create();

        this.MIN_Y = 0.1;
        this.DELTA_TRANSLATION = 0.2;
        this.DELTA_ROTATION = 0.02;
        this.INERTIA_FACTOR = 0.05;
        
        if (!initialPos) {
            this.initialPos = [0, 0, 0];
        }

        this.position = vec3.fromValues(initialPos[0],initialPos[1],initialPos[2]);
        this.rotation = vec3.create();
        this.worldMatrix = mat4.create();
        this.cameraInitialState = {
            xVel: 0,
            zVel: 0,
            yVel: 0,
            xVelTarget: 0,
            zVelTarget: 0,
            yVelTarget: 0,
            yRotVelTarget: 0,
            yRotVel: 0,
            zRotVelTarget: 0,
            zRotVel: 0,
            xRotVelTarget: 0,
            xRotVel: 0,
            rightAxisMode: 'move'
        };

        this.cameraState = Object.assign({}, this.cameraInitialState);
    }
    
    update() {
        this.cameraState.xVel += (this.cameraState.xVelTarget-this.cameraState.xVel)*this.INERTIA_FACTOR;
        this.cameraState.yVel += (this.cameraState.yVelTarget-this.cameraState.yVel)*this.INERTIA_FACTOR;
        this.cameraState.zVel += (this.cameraState.zVelTarget-this.cameraState.zVel)*this.INERTIA_FACTOR;

        this.cameraState.xRotVel += (this.cameraState.xRotVelTarget-this.cameraState.xRotVel)*this.INERTIA_FACTOR;
        this.cameraState.yRotVel += (this.cameraState.yRotVelTarget-this.cameraState.yRotVel)*this.INERTIA_FACTOR;

        let translation = vec3.fromValues(-this.cameraState.xVel, this.cameraState.yVel, -this.cameraState.zVel);
        let rotIncrement = vec3.fromValues(this.cameraState.xRotVel, this.cameraState.yRotVel, this.cameraState.zRotVel);            
        vec3.add(this.rotation, this.rotation, rotIncrement);

        this.rotation[0] = Math.min(Math.PI/8, Math.max(-Math.PI/8, this.rotation[0]));
        
        let rotationMatrix = mat4.create();
        mat4.rotateX(rotationMatrix, rotationMatrix, this.rotation[0]);
        
        let yAxis = vec3.fromValues(0, 1, 0);
        let xRotation = mat4.create();
        mat4.rotateX(xRotation, xRotation, this.rotation[0]);
        vec3.transformMat4(yAxis, yAxis, xRotation);

        mat4.rotate(rotationMatrix, rotationMatrix, this.rotation[1], yAxis);

        vec3.transformMat4(translation, translation, rotationMatrix);
        vec3.add(this.position, this.position, translation);

        this.worldMatrix=mat4.create();
        mat4.translate(this.worldMatrix, this.worldMatrix, this.position);        
        mat4.multiply(this.worldMatrix, this.worldMatrix, rotationMatrix);   
    }

    move(x, y, z) {
        this.cameraState.xVelTarget = this.DELTA_TRANSLATION*(-x);
        this.cameraState.yVelTarget = this.DELTA_TRANSLATION*y;
        this.cameraState.zVelTarget = this.DELTA_TRANSLATION*z;
    }

    rotate(y) {
        this.cameraState.yRotVelTarget = this.DELTA_ROTATION*(-y);
    }

    getPVMatrix() {
        let viewMatrix = mat4.clone(this.worldMatrix);            
        mat4.invert(viewMatrix, viewMatrix);
        
        mat4.multiply(this.PV_Matrix, this.projectionMatrix, viewMatrix);
        return this.PV_Matrix;
    }

    getPosition() {
        return this.position;
    }
}

//==============================================================================
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
        this.velocity = 0.9;
        this.radio = 50;
        this.delta_radio = 1;
        this.dragging = false;
        this.dX = 0;
        this.dY = 0;
        this.update();

        // mat4.multiply(this.PV_Matrix, this.projectionMatrix, this.viewMatrix);
    }

    fixInitMovePosition(event) {
        this.old.x = event.pageX;
        this.old.y = event.pageY;
    }

    drag(opt) {
        this.dragging = opt;
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
        this.dX = (event.pageX - this.old.x)*2*Math.PI/canvas.width;
        this.dY = (event.pageY - this.old.y)*2*Math.PI/canvas.height;

        this.old.x = event.pageX;
        this.old.y = event.pageY;
        
        this.azimuth += this.dX;
        this.colatitude += this.dY;
        // this.azimuth += dX*this.velocity;
        // this.colatitude += dY*this.velocity;

        // Cota
        if (this.colatitude >= 0.45*Math.PI) {
            this.colatitude = 0.45*Math.PI;
        } else if (this.colatitude < 0.1) {
            this.colatitude = 0.1;
        }

        // this.update();
    }

    update() {
        if (!this.dragging) {
            this.dX *= this.velocity;
            this.dY *= this.velocity;
            this.azimuth += this.dX;
            this.colatitude += this.dY;

            if (this.colatitude >= 0.45*Math.PI) {
                this.colatitude = 0.45*Math.PI;
            } else if (this.colatitude < 0.1) {
                this.colatitude = 0.1;
            }
        }

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
        return this.eye_position;
    }
}

//==============================================================================
class ObjectCamera {
    constructor(worldMatrix, projectionMatrix) {
        this.worldMatrix = mat4.clone(worldMatrix);
        this.viewMatrix = mat4.create();
        mat4.invert(this.viewMatrix, worldMatrix);
        this.projectionMatrix = mat4.clone(projectionMatrix);

        this.PV_Matrix = mat4.create();
        mat4.multiply(this.PV_Matrix, this.projectionMatrix, this.viewMatrix);
        
        this.viewDirection = vec3.create();
        this.viewDirection[0] = this.viewMatrix[2];
        this.viewDirection[1] = this.viewMatrix[6];
        this.viewDirection[3] = this.viewMatrix[10];
    }

    changePosition(worldMatrix) {
        this.worldMatrix = mat4.clone(worldMatrix);
        mat4.invert(this.viewMatrix, worldMatrix);
        mat4.multiply(this.PV_Matrix, this.projectionMatrix, this.viewMatrix);
    }

    getPVMatrix() {
        return this.PV_Matrix;
    }

    getPosition() {
        let position = vec3.create();
        mat4.getTranslation(position, this.worldMatrix);
        return position;
    }

    update() {}
}

//==============================================================================