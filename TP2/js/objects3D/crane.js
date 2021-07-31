class Crane {
    constructor(shaderProgram) {
        let aCube = new Cube();
        this.segment_A_node = new Node();
        this.segment_A_node.setShaderProgram(shaderProgram);
        this.segment_A_node.setGeometry(aCube);
        this.segment_A_node.setScale(4, 16, 4);
        this.segment_A_node.setPosition(0, 8, 0);
        
        this.base = new Node();
        this.base.setPosition(0, 6, 0);
        this.segment_A_node.setParent(this.base);

        this.segment_B_node = new Node();
        this.segment_B_node.setShaderProgram(shaderProgram);
        this.segment_B_node.setGeometry(aCube);
        this.segment_B_node.setParent(this.segment_A_node);
        this.segment_B_node.setScale(3, 16, 3);
        this.segment_B_node.setPosition(0, 16, 0);

        let aParametricCylinder = new ParametricCylinder(1, 1);
        let CylinderSurface = new Surface(aParametricCylinder, 1, 25);
        this.segment_C_node = new Node();
        this.segment_C_node.setShaderProgram(shaderProgram);
        this.segment_C_node.setGeometry(CylinderSurface);
        this.segment_C_node.setParent(this.segment_B_node);
        this.segment_C_node.setScale(1, 16, 1);
        this.segment_C_node.setPosition(0, 16, 0);

        this.aCabin = new Cabin(shaderProgram);
        this.segment_D_node = this.aCabin.getNode();
        this.segment_D_node.setParent(this.segment_C_node);
        this.segment_D_node.setPosition(0, 9.5, 0);

        this.segment_E_node = new Node();
        this.segment_E_node.setShaderProgram(shaderProgram);
        this.segment_E_node.setGeometry(aCube);
        this.segment_E_node.setParent(this.segment_D_node);
        this.segment_E_node.setScale(1, 3, 1);
        this.segment_E_node.setPosition(0, 3, 0);

        this.segment_F_node = new Node();
        this.segment_F_node.setShaderProgram(shaderProgram);
        this.segment_F_node.setGeometry(aCube);
        this.segment_F_node.setParent(this.segment_E_node);
        this.segment_F_node.setScale(1, 1, 40);
        this.segment_F_node.setPosition(0, 1.5, -10);

        this.counterWeight = new Node();
        this.counterWeight.setShaderProgram(shaderProgram);
        this.counterWeight.setGeometry(aCube);
        this.counterWeight.setParent(this.segment_F_node);
        this.counterWeight.setScale(4, 2, 2);
        this.counterWeight.setPosition(0, 0, 20);

        this.segment_G_node = new Node();
        this.segment_G_node.setShaderProgram(shaderProgram);
        this.segment_G_node.setGeometry(CylinderSurface);
        this.segment_G_node.setParent(this.segment_F_node);
        this.wireLong = 24;
        this.minWireLong = 2;
        this.maxWireLong = 30;

        this.segment_G_node.setScale(0.1, this.wireLong, 0.1);
        this.segment_G_node.setPosition(0, -this.wireLong/2, -19.5);

        this.endWirePoint = new Node();
        this.endWirePoint.setParent(this.segment_G_node); // vacío, se usa como referencia.
        this.endWirePoint.setPosition(0, -this.wireLong/2, 0);

        this.wire2 = new Node();
        this.wire2.setShaderProgram(shaderProgram);
        this.wire2.setGeometry(CylinderSurface);
        this.wire2.setParent(this.endWirePoint);
        this.wire2.setScale(0.1, 4, 0.1);
        let _sqrt2 = Math.sqrt(2);
        this.wire2.setPosition(_sqrt2, -_sqrt2, -_sqrt2);
        this.wire2.setRotation(45, 0, 45);
        
        this.segment_H_node = new Node();
        this.segment_H_node.setShaderProgram(shaderProgram);
        this.segment_H_node.setGeometry(aCube);
        this.segment_H_node.setParent(this.endWirePoint);
        this.segment_H_node.setScale(6, 0.1, 6);
        this.segment_H_node.setPosition(0, -2, 0);

        this.handAngle = 0; // en grados.
        this.minHandAngle = -45;
        this.maxHandAngle = 45;

        this.extension = 1; // entre 0 y 1.
        this.min_extension = 0;
        this.max_extension = 1;

        this.cabinAngle = 0;
    }


    setPosition(x, y, z) {
        this.segment_A_node.setPosition(x, y, z);
    }

    getNode() {
        return this.base; 
    }

    rotateCabin(angle) {
        this.cabinAngle += angle;
        this.segment_C_node.setRotation(0, this.cabinAngle, 0);
    }

    rotateHand(angle) {
        this.handAngle += angle;
        if (this.handAngle <= this.minHandAngle) {
            this.handAngle = this.minHandAngle;
        } else if (this.handAngle >= this.maxHandAngle) {
            this.handAngle = this.maxHandAngle;
        }
        let rad = this.handAngle*Math.PI/180;
        this.segment_F_node.setPosition(0, 1.5 + 10*Math.sin(rad), -10*Math.cos(rad));
        this.segment_F_node.setRotation(this.handAngle, 0, 0);
        this.segment_G_node.setPosition(0, -this.wireLong/2*Math.cos(rad), -19.5 + this.wireLong/2*Math.sin(rad));
        this.segment_G_node.setRotation(-this.handAngle, 0, 0);
    }

    extendBase(value) {
        this.extension += value;
        if (this.extension <= this.min_extension) {
            this.extension = this.min_extension
        } else if (this.extension >= this.max_extension) {
            this.extension = this.max_extension
        }
        this.segment_B_node.setPosition(0, 16*this.extension, 0);
        this.segment_C_node.setPosition(0, 16*this.extension, 0);
    }

    extendWire(value) {
        this.wireLong += value;
        if (this.wireLong <= this.minWireLong) {
            this.wireLong = this.minWireLong;
        } else if (this.wireLong >= this.maxWireLong) {
            this.wireLong = this.maxWireLong;
        }
        this.segment_G_node.setScale(0.1, this.wireLong, 0.1);
        let rad = this.handAngle*Math.PI/180;

        this.segment_G_node.setPosition(0, -this.wireLong/2*Math.cos(rad), -19.5 + this.wireLong/2*Math.sin(rad));
        this.endWirePoint.setPosition(0, -this.wireLong/2, 0);
    }

    getView() {
        return this.segment_D_node.worldMatrix;
    }
}