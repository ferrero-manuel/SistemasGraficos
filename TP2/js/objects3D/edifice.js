class Edifice {
    constructor(numWinWidth, numWinLong, floors_1, floors_2, perimetralCols) {
        // Parámetros de construcción.
        this.numWinWidth = numWinWidth;
        this.numWinLong = numWinLong;
        this.floors_1 = floors_1;
        this.floors_2 = floors_2;
        this.perimetralCols = perimetralCols;
        
        this.winSize = 3;

        // Nodo del edificio.
        this.edificeNode = new Node();

        this.original_control_points = [];
        this.control_points = [];
        this.listBSplines = [];
        this.ParametricCurve = {};
        this.aDiscretizer = {};

        let aParametricCylinder = new ParametricCylinder(0.5, 4);
        this.CylinderSurface = new Surface(aParametricCylinder, 8, 8);

        this.shaderProgramBasic = [];
        this.shaderProgramTextures = [];
        this.textures = [];
        this.columnTexture = [];
    }

    setShaderProgram(shaderProgramBasic, shaderProgramTextures, textures) {
        this.shaderProgramBasic = shaderProgramBasic;
        this.shaderProgramTextures = shaderProgramTextures;
        this.textures = textures;
    }

    setColumnTexture(columnTexture) {
        this.columnTexture = columnTexture;
    }

    getNode() {
        return this.edificeNode;
    }
    
    setWinWidth(n) {
        this.numWinWidth = n;
        this.build();
    }

    setWinLong(n) {
        this.numWinLong = n;
        this.build();
    }

    setFloors_1(n) {
        this.floors_1 = n;
        this.build();
    }

    setFloors_2(n) {
        this.floors_2 = n;
        this.build();
    }

    setPerimetralCols(n) {
        this.perimetralCols = n;
        this.build();
    }
    
    build() {
        this.edificeNode.children = [];
        
        this._buildLowLevel();

        this._buildDiscretizer(this.numWinLong, this.numWinWidth);
        this.aSlab = new Slab();
        this.aSlab.build(this.aDiscretizer, 100);

        for (let floor = 0; floor < this.floors_1; floor++) {
            let aNode = new Node();
            aNode.setShaderProgramTexture(this.shaderProgramTextures, this.textures, 1);
            aNode.setGeometry(this.aSlab);
            aNode.setParent(this.edificeNode);
            aNode.setPosition(0, 4 + 4*floor, 0);

            let aCube = new Cube();
            
            let elevatorNode = new Node();
            elevatorNode.setShaderProgram(this.shaderProgramBasic);
            elevatorNode.setGeometry(aCube);
            elevatorNode.setParent(aNode);
            elevatorNode.setPosition(0, 2, 0);
            elevatorNode.setScale(4, 4, 4);

            let cols_loc = this.aDiscretizer.getCurve(this.perimetralCols + 1);
            let cols_move = this.aDiscretizer.getNormal(this.perimetralCols + 1);

            for (let i = 0, x, y, z; i < cols_loc.length - 1; i++) {
                let cylinderNode = new Node();
                cylinderNode.setShaderProgramTexture(this.shaderProgramTextures, this.textures, 0);
                cylinderNode.setGeometry(this.CylinderSurface);
                cylinderNode.setParent(aNode);
                x = cols_loc[i][0] - cols_move[i][0];
                y = cols_loc[i][1] - cols_move[i][1];
                z = cols_loc[i][2] - cols_move[i][2];
                cylinderNode.setPosition(x, y + 2.5, z);
            }

            for (let i = 0; i < this.original_control_points.length; i++) {
                let x = this.original_control_points[i][0];
                let y = this.original_control_points[i][1];
                let z = this.original_control_points[i][2];
                let column = new Node();
                column.setShaderProgram(this.shaderProgramBasic);
                column.setGeometry(aCube);
                column.setParent(aNode);
                column.setPosition(x, y + 2.5, z);
                column.setScale(0.25, 4, 0.25);
            }
        }

        let aNode = new Node();
        aNode.setShaderProgramTexture(this.shaderProgramTextures, this.textures, 1);
        aNode.setGeometry(this.aSlab);
        aNode.setParent(this.edificeNode);
        aNode.setPosition(0, 4 + 4*this.floors_1, 0);

        this._buildDiscretizer(this.numWinLong - 2, this.numWinWidth - 2);
        this.aSlab = new Slab();
        this.aSlab.build(this.aDiscretizer, 100);

        for (let floor = 0; floor <= this.floors_2; floor++) {
            let aCube = new Cube();
            
            let elevatorNode = new Node();
            elevatorNode.setShaderProgram(this.shaderProgramBasic);
            elevatorNode.setGeometry(aCube);
            elevatorNode.setParent(aNode);
            elevatorNode.setPosition(0, 2, 0);
            elevatorNode.setScale(4, 4, 4);

            let cols_loc = this.aDiscretizer.getCurve(this.perimetralCols + 1);
            let cols_move = this.aDiscretizer.getNormal(this.perimetralCols + 1);

            for (let i = 0, x, y, z; i < cols_loc.length - 1; i++) {
                let cylinderNode = new Node();
                cylinderNode.setShaderProgramTexture(this.shaderProgramTextures, this.textures, 0);
                cylinderNode.setGeometry(this.CylinderSurface);
                cylinderNode.setParent(aNode);
                x = cols_loc[i][0] - cols_move[i][0];
                y = cols_loc[i][1] - cols_move[i][1];
                z = cols_loc[i][2] - cols_move[i][2];
                cylinderNode.setPosition(x, y + 2.5, z);
            }

            for (let i = 0; i < this.original_control_points.length; i++) {
                let x = this.original_control_points[i][0];
                let y = this.original_control_points[i][1];
                let z = this.original_control_points[i][2];
                let column = new Node();
                column.setShaderProgram(this.shaderProgramBasic);
                column.setGeometry(aCube);
                column.setParent(aNode);
                column.setPosition(x, y + 2.5, z);
                column.setScale(0.25, 4, 0.25);
            }
            
            aNode = new Node();
            aNode.setShaderProgramTexture(this.shaderProgramTextures, this.textures, 1);
            aNode.setGeometry(this.aSlab);
            aNode.setParent(this.edificeNode);
            aNode.setPosition(0, 4 + 4*(this.floors_1 + floor), 0);
        }

        let aCube = new Cube();
        let elevatorNode = new Node();
        elevatorNode.setShaderProgram(this.shaderProgramBasic);
        elevatorNode.setGeometry(aCube);
        elevatorNode.setParent(aNode);
        elevatorNode.setPosition(0, 1, 0);
        elevatorNode.setScale(4, 1, 4);
    }

    _buildLowLevel() {
        let lowLevel = new Cube();
        let lowLevelNode = new Node();
        lowLevelNode.setShaderProgram(this.shaderProgramBasic);
        lowLevelNode.setGeometry(lowLevel);
        lowLevelNode.setPosition(0, 2, 0);
        lowLevelNode.setScale(9, 4, 9);
        lowLevelNode.setParent(this.edificeNode);

        let lowLevelRightNode = new Node();
        lowLevelRightNode.setShaderProgram(this.shaderProgramBasic);
        lowLevelRightNode.setGeometry(lowLevel);
        lowLevelRightNode.setPosition(7.5, 0, 0);
        lowLevelRightNode.setScale(7.5, 4, 12);
        lowLevelRightNode.setParent(lowLevelNode);

        let lowLevelLeftNode = new Node();
        lowLevelLeftNode.setShaderProgram(this.shaderProgramBasic);
        lowLevelLeftNode.setGeometry(lowLevel);
        lowLevelLeftNode.setParent(lowLevelNode);
        lowLevelLeftNode.setPosition(-7.5, 0, 0);
        lowLevelLeftNode.setScale(7.5, 4, 12);
    }
    
    _addNoise(n) {
        return 3*Math.abs(Math.cos(1234*n)) + 2;
    }

    _buildDiscretizer(numWinLong, numWinWidth) {
        this.original_control_points = [];
        this.control_points = [];
        this.listBSplines = [];
        this.ParametricCurve = new MultipleParametricCurve();
        this.aDiscretizer = new CurveDiscretizer(this.ParametricCurve);

        let close_long = this.winSize*numWinLong;
        let close_width = this.winSize*numWinWidth;
        // Construir el cuadrado de puntos de control.
        let x, z;
        for (let i = 0; i < numWinLong; i++) {
            x = i*this.winSize - close_long/2;
            this.original_control_points.push(vec3.fromValues(x, 0, close_width/2));
            if (i == 0) {
                x -= this._addNoise(i)/4;
            }
            this.control_points.push(vec3.fromValues(x, 0, close_width/2 + this._addNoise(i)));
        }

        for (let i = 0; i < numWinWidth; i++) {
            z = close_width/2  - i*this.winSize;
            this.original_control_points.push(vec3.fromValues(close_long/2, 0, z));
            if (i == 0) {
                z += this._addNoise(i)/4;
            }
            this.control_points.push(vec3.fromValues(close_long/2 + this._addNoise(i), 0, z));
        }

        for (let i = 0; i < numWinLong; i++) {
            x = close_long/2 - i*this.winSize;
            this.original_control_points.push(vec3.fromValues(x, 0, -close_width/2));
            if (i == 0) {
                x += this._addNoise(i)/4;
            }
            this.control_points.push(vec3.fromValues(x, 0, -close_width/2 - this._addNoise(i)));
        }

        for (let i = 0; i < numWinWidth; i++) {
            z = i*this.winSize - close_width/2;
            this.original_control_points.push(vec3.fromValues(-close_long/2, 0, z));
            if (i == 0) {
                z -= this._addNoise(i)/4;
            }
            this.control_points.push(vec3.fromValues(-close_long/2 - this._addNoise(i), 0, z));
        }

        // Construir las curvas de Bspline.
        let p0, p1, p2;
        for (let i = 0; i < this.control_points.length - 2; i++) {
            p0 = this.control_points[i];
            p1 = this.control_points[i + 1];
            p2 = this.control_points[i + 2];
            this.listBSplines.push(new CuadraticBSplineCurve(p0, p1, p2));
        }
        // La ante-última curva repite un punto.
        p0 = this.control_points[this.control_points.length - 2];
        p1 = this.control_points[this.control_points.length - 1];
        p2 = this.control_points[0];
        this.listBSplines.push(new CuadraticBSplineCurve(p0, p1, p2));
        // La última curva curva repite dos puntos.
        p0 = this.control_points[this.control_points.length - 1];
        p1 = this.control_points[0];
        p2 = this.control_points[1];
        this.listBSplines.push(new CuadraticBSplineCurve(p0, p1, p2));

        // Fijar binormal de las curvas.
        this.listBSplines.forEach(element => element.fixBinormal(0, -1, 0));
        // Crear la curva parámetrica múltiple.
        this.listBSplines.forEach(element => this.ParametricCurve.addCurve(element));
    }
}