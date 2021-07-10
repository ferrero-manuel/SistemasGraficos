//==============================================================================
let canvas = document.getElementById('my_Canvas');
gl = canvas.getContext('experimental-webgl');

//==============================================================================
// Crear shader.
let vertCode = document.getElementById('vertexShader').textContent;
let fragCode = document.getElementById('fragmentShader').textContent;
let vertShader = createShader(gl, gl.VERTEX_SHADER, vertCode);
let fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragCode);
let shaderProgram = createProgram(gl, vertShader, fragShader);

//==============================================================================
// Construir escena.
let myScene = new glScene();

// Terrerno.
let aTerrain = new Terrain();
let aTerrainNode = new Node();
aTerrainNode.setShaderProgram(shaderProgram);
aTerrainNode.setGeometry(aTerrain);
myScene.addNode(aTerrainNode);

class FloorEdifice {
    constructor() {
        this.numCols = 0;
        this.winSize = 3;
        this.winWidth = 4;
        this.winLong = 8;

        this.numCtrlPointsLong = 8;
        this.numCtrlPointsWidth = 4;

        this.original_control_points = [];
        this.control_points = [];
        this.listBSplines = [];
        this.ParametricCurve = new MultipleParametricCurve();
        this.aDiscretizer = new CurveDiscretizer(this.ParametricCurve);

        this.aNode = new Node();
    }

    setWinWidth(n) {
        this.winnWidth = n;
        this.numCtrlPointsWidth = n;        
    }

    setWinLong(n) {
        this.winLong = n;
        this.numCtrlPointsLong = n;
    }

    setNumCols(n) {
        this.numCols = n;
    }

    _addNoise(n) {
        return 4*Math.abs(Math.cos(1234*n));
    }

    build(shaderProgram) {
        this.detCtrlPoints();
        let aSlab = new Slab();
        aSlab.build(this.aDiscretizer, 100);

        let aNode = new Node();
        aNode.setGeometry(aSlab);
        // aNode.setPosition(0, 4, 0);

        let num_cols = 8 + 1;
        // repite último punto.
        let cols_loc = this.aDiscretizer.getCurve(num_cols);
        let cols_move = this.aDiscretizer.getNormal(num_cols);

        let aParametricCylinder = new ParametricCylinder(0.5, 4);
        let CylinderSurface = new Surface(aParametricCylinder, 8, 8);
        
        for (let i = 0, x, y, z; i < cols_loc.length - 1; i++) {
            let cylinderNode = new Node();
            cylinderNode.setShaderProgram(shaderProgram);
            cylinderNode.setGeometry(CylinderSurface);
            cylinderNode.setParent(aNode);
            x = cols_loc[i][0] - cols_move[i][0];
            y = cols_loc[i][1] - cols_move[i][1];
            z = cols_loc[i][2] - cols_move[i][2];
            cylinderNode.setPosition(x, y + 2.5, z);
            
        }
        
        let aCube = new Cube();
        this.original_control_points.forEach(function(element) {
            let column = new Node();
            column.setShaderProgram(shaderProgram);
            column.setGeometry(aCube);
            column.setParent(aNode);
            column.setPosition(element[0], element[1] + 2.5, element[2]);
            column.setScale(0.25, 4, 0.25);
        });
        
        return aNode;
    }

    detCtrlPoints() {
        let close_long = this.winSize*this.winLong;
        let close_width = this.winSize*this.winWidth;
        // Construir el cuadrado de puntos de control.
        let x, z;
        for (let i = 0; i < this.numCtrlPointsLong; i++) {
            x = i*this.winSize - close_long/2;
            this.original_control_points.push(vec3.fromValues(x, 0, close_width/2));
            this.control_points.push(vec3.fromValues(x, 0, close_width/2 + this._addNoise(i)));
        }

        for (let i = 0; i < this.numCtrlPointsWidth; i++) {
            z = close_width/2  - i*this.winSize;
            this.original_control_points.push(vec3.fromValues(close_long/2, 0, z));
            this.control_points.push(vec3.fromValues(close_long/2 + this._addNoise(i), 0, z));
        }

        for (let i = 0; i < this.numCtrlPointsLong; i++) {
            x = close_long/2 - i*this.winSize;
            this.original_control_points.push(vec3.fromValues(x, 0, -close_width/2));
            this.control_points.push(vec3.fromValues(x, 0, -close_width/2 - this._addNoise(i)));
        }

        for (let i = 0; i < this.numCtrlPointsWidth; i++) {
            z = i*this.winSize - close_width/2;
            this.original_control_points.push(vec3.fromValues(-close_long/2, 0, z));
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

class Edifice {
    constructor(floors_1, floors_2, perimetral_cols) {
        this.floors_1 = floors_1;
        this.floors_2 = floors_2;;
        this.perimetral_cols = perimetral_cols;

        this.principalNode = new Node();

        let lowLevel = new Cube();
        this.lowLevelNode = new Node();
        this.lowLevelNode.setShaderProgram(shaderProgram);
        this.lowLevelNode.setGeometry(lowLevel);
        this.lowLevelNode.setPosition(0, 2, 0);
        this.lowLevelNode.setScale(9, 4, 9);
        
        let lowLevelRightNode = new Node();
        lowLevelRightNode.setShaderProgram(shaderProgram);
        lowLevelRightNode.setGeometry(lowLevel);
        lowLevelRightNode.setPosition(7.5, 0, 0);
        lowLevelRightNode.setScale(7.5, 4, 12);
        lowLevelRightNode.setParent(this.lowLevelNode);

        let lowLevelLeftNode = new Node();
        lowLevelLeftNode.setShaderProgram(shaderProgram);
        lowLevelLeftNode.setGeometry(lowLevel);
        lowLevelLeftNode.setParent(this.lowLevelNode);
        lowLevelLeftNode.setPosition(-7.5, 0, 0);
        lowLevelLeftNode.setScale(7.5, 4, 12);

        this.principalNode.setParent(this.lowLevelNode);
    }

    setFloors1(numFloors) {
        this.floors_1 = numFloors;
    }

    setFloors2(numFloors) {
        this.floors_2 = numFloors;
    }

    build() {
        this.principalNode.children = [];
        for (let i = 0; i < this.floors_1; i++) {
            let floor = new FloorEdifice();
            let floorNode = floor.build(shaderProgram);
            floorNode.setShaderProgram(shaderProgram);
            floorNode.setParent(this.principalNode);
            floorNode.setPosition(0, 2 + i*4, 0);
            console.log(i)
        }

        // for (let i = 0; i < this.floors_2; i++) {
        //     let floor = new FloorEdifice();
        //     floor.setWinLong(5);
        //     floor.setWinWidth(3);
        //     let floorNode = floor.build(shaderProgram);
        //     floorNode.setShaderProgram(shaderProgram);
        //     floorNode.setParent(this.principalNode);
        //     floorNode.setPosition(0, this.floors_1*4 + 2 + i*4, 0);
        // }

        // let aSlab = new Slab();
        // aSlab.build(this.aDiscretizer, 100);

        // let aNode = new Node();
        // aNode.setGeometry(aSlab);
        // aNode.setParent(principalNode);
        // aNode.setPosition(2 + (this.floors_1 + this.floors_2)*4);
    }

    getNode() {
        return this.lowLevelNode;
    }
}


let aEdifice = new Edifice(2, 2, 8);
aEdifice.build();
aEdificeNode = aEdifice.getNode();
myScene.addNode(aEdificeNode);

var aCrane = new Crane(shaderProgram);
aCrane.setPosition(15, 0, 15);
myScene.addNode(aCrane.getNode());


//==============================================================================
// let aSlide = new Slide();
// let slideNode = new Node();
// slideNode.setGeometry(aSlide);
// slideNode.setShaderProgram(shaderProgram);
// slideNode.setParent(lowLevelNode);
// slideNode.setPosition(0, 0, 20);
// slideNode.setScale(1, 1, 1);


//==============================================================================
// Iniciar cámaras y definir matriz de proyección.
let proj_matrix = mat4.create();
mat4.perspective(proj_matrix, 1, canvas.width/canvas.height, 1, 100)

let aDroneCamera = new DroneCamera([-20.0, 40.0, 40.0], [0.0, 20.0, 0.0], [0.0, 1.0, 0.0], proj_matrix);
let activeCamera = aDroneCamera;
myScene.setCamera(aDroneCamera);

let aOrbitalCamera = new OrbitalCamera([40.0, 40.0, -20.0], [0.0, 20.0, 0.0], proj_matrix);

let aCraneCamera = new ObjectCamera(aCrane.getView(), proj_matrix);

//==============================================================================
// Controles DAT-GUI.
var controls = {
    edifice: aEdifice,
    edificeFloor_1: 2,
    edificeFloor_2: 2,
};

let gui = new dat.GUI();
let edificeFolder = gui.addFolder('Edificio');

edificeFolder.add(controls, 'edificeFloor_1', 2, 5).step(1).onChange(function(value) {
    controls.edificeFloor_1 = value;
    controls.edifice.setFloors1(value);
    controls.edifice.build();
});

edificeFolder.add(controls, 'edificeFloor_2', 2, 5).step(1).onChange(function(value) {
    controls.edificeFloor_2 = value;
    controls.edifice.setFloors2(value);
    controls.edifice.build();
});

//==============================================================================
// Manejador de eventos del mouse.
let drag = false;

let mouseDown = function(e) {
    drag = true;
    aOrbitalCamera.fixInitMovePosition(e);
    e.preventDefault();

    return false;
};

let mouseUp = function(_e){
    drag = false;
};

let mouseMove = function(e) {
    if (!drag) {
        return false;
    }
    
    aOrbitalCamera.move(e);
    e.preventDefault();
};

let wheelMove = function(e) {
    aOrbitalCamera.zoom(e);
};

document.addEventListener("mousedown", mouseDown, false);
document.addEventListener("mouseup", mouseUp, false);
document.addEventListener("mouseout", mouseUp, false);
document.addEventListener("mousemove", mouseMove, false);
document.addEventListener("wheel", wheelMove, false);

//==============================================================================
// Manejador de eventos del teclado.
document.addEventListener('keydown', (event) => {
    let name = event.key;

    // let code = event.code;
    // console.log(`Key pressed ${name} \r\n Key code value: ${code}`);

    switch (name) {
        // Selector de cámaras.
        case '1':
            activeCamera = aDroneCamera;
            myScene.setCamera(activeCamera);
            break;
        case '2':
            activeCamera = aOrbitalCamera;
            myScene.setCamera(activeCamera);
            break;
        case '3':
            activeCamera = aCraneCamera;
            myScene.setCamera(activeCamera);
            break;

        // Control de la grúa.
        // Expandir y contraer columna princiapal de la grúa.
        case 'Q':
        case 'q':
            aCrane.extendBase(0.01);
            aCraneCamera.changePosition(aCrane.getView());
            break;
        case 'A':
        case 'a':
            aCrane.extendBase(-0.01);
            aCraneCamera.changePosition(aCrane.getView());
            break;
        // Rotar cabina.
        case 'J':
        case 'j':
            aCrane.rotateCabin(1);
            aCraneCamera.changePosition(aCrane.getView());
            break;
        case 'L':
        case 'l':
            aCrane.rotateCabin(-1);
            aCraneCamera.changePosition(aCrane.getView());
            break;
        // Rotar brazo.
        case 'I':
        case 'i':
            aCrane.rotateHand(1);
            break;
        case 'K':
        case 'k':
            aCrane.rotateHand(-1);
            break;
        // Extender/contraer cable.
        case 'W':
        case 'w':
            aCrane.extendWire(-0.1);
            break;
        case 'S':
        case 's':
            aCrane.extendWire(0.1);
            break;
        
        // Control de cámara drone.
        case 'ArrowUp':
            aDroneCamera.move(0, 0, -1);
            break;
        case 'ArrowDown':
            aDroneCamera.move(0, 0, +1);
            break;
        case 'ArrowLeft':
            aDroneCamera.move(-1, 0, 0);
            break;
        case 'ArrowRight':
            aDroneCamera.move(+1, 0, 0);
            break;
        case 'T':
        case 't':
            aDroneCamera.move(0, +1, 0);
            break;
        case 'G':
        case 'g':
            aDroneCamera.move(0, -1, 0);
            break;
        case 'F':
        case 'f':
            aDroneCamera.rotateY(0.1);
            break;
        case 'H':
        case 'h':
            aDroneCamera.rotateY(-0.1);
            break;
        default:
            break;
    }
}, false);


//==============================================================================
// Loop de dibujado.
let animate = function(_time) {
    gl.enable(gl.DEPTH_TEST);

    gl.viewport(0.0, 0.0, canvas.width, canvas.height);

    gl.clearColor(217.0/255, 226.0/255, 236.0/255, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    myScene.draw();
    window.requestAnimationFrame(animate);
}
animate(0);

//==============================================================================