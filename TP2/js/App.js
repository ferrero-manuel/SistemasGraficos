//==============================================================================
let canvas = document.getElementById('my_Canvas');
gl = canvas.getContext('experimental-webgl');

//==============================================================================
// Texturas.
let aTextureUnits = new TextureUnits();
aTextureUnits.addTexture('js/textures/column_texture.jpg');
aTextureUnits.addTexture('js/textures/slab_texture.jpg');

//==============================================================================
// Crear shader.
let vertCode = document.getElementById('vertexShader').textContent;
let fragCode = document.getElementById('fragmentShader').textContent;
let vertShader = createShader(gl, gl.VERTEX_SHADER, vertCode);
let fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragCode);
let shaderProgramBasic = createProgram(gl, vertShader, fragShader);

vertCode = document.getElementById('vertexShaderTextures').textContent;
fragCode = document.getElementById('fragmentShaderTextures').textContent;
vertShader = createShader(gl, gl.VERTEX_SHADER, vertCode);
fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragCode);
let shaderProgramTextures = createProgram(gl, vertShader, fragShader);

//==============================================================================
// Construir escena.
let myScene = new glScene();

// Terrerno.
let aTerrain = new Terrain();
let aTerrainNode = new Node();
aTerrainNode.setShaderProgram(shaderProgramBasic);
aTerrainNode.setGeometry(aTerrain);
myScene.addNode(aTerrainNode);

let aEdifice = new Edifice(5, 8, 2, 2, 8);
aEdifice.setShaderProgram(shaderProgramBasic, shaderProgramTextures, aTextureUnits.textures);
// aEdifice.setColumnTexture(column_texture);
aEdifice.build();
aEdificeNode = aEdifice.getNode();
myScene.addNode(aEdificeNode);

var aCrane = new Crane(shaderProgramBasic);
aCrane.setPosition(20, 0, 20);
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
mat4.perspective(proj_matrix, 1, canvas.width/canvas.height, 1, 200)

aDroneCamera = new DroneCamera([0, 10, 50], proj_matrix);
let activeCamera = aDroneCamera;
myScene.setCamera(aDroneCamera);

let aOrbitalCamera = new OrbitalCamera([40.0, 40.0, -20.0], [0.0, 5.0, 0.0], proj_matrix);

let aCraneCamera = new ObjectCamera(aCrane.getView(), proj_matrix);

//==============================================================================
// Iluminación
let aDirLight = new DirectionalLighting(0, 0.25);
myScene.setDirLight(aDirLight);

//==============================================================================
// Controles DAT-GUI.
var controls = {
    edifice: aEdifice,
    numWinWidth: 5,
    numWinLong: 8,
    numFloors_1: 2,
    numFloors_2: 2,
    numPerimetralCols: 8,
    dirLight: aDirLight,
    dirLightAzimuth: 0,
    dirLightColatitude: 0.25
};

let gui = new dat.GUI();
let edificeFolder = gui.addFolder('Edificio');
let lightFolder = gui.addFolder('Luces');

edificeFolder.add(controls, 'numWinWidth', 5, 7).step(1).onChange(function(value) {
    controls.numWinWidth = value;
    controls.edifice.setWinWidth(value);
});

edificeFolder.add(controls, 'numWinLong', 8, 10).step(1).onChange(function(value) {
    controls.numWinLong = value;
    controls.edifice.setWinLong(value);
});

edificeFolder.add(controls, 'numFloors_1', 1, 5).step(1).onChange(function(value) {
    controls.numFloor_1 = value;
    controls.edifice.setFloors_1(value);
});

edificeFolder.add(controls, 'numFloors_2', 1, 5).step(1).onChange(function(value) {
    controls.numFloors_2 = value;
    controls.edifice.setFloors_2(value);
});

edificeFolder.add(controls, 'numPerimetralCols', 3, 12).step(1).onChange(function(value) {
    controls.numPerimetralCols = value;
    controls.edifice.setPerimetralCols(value);
});

lightFolder.add(controls, 'dirLightAzimuth', 0, 2*Math.PI).step(0.1).onChange(function(value) {
    controls.dirLightAzimuth = value;
    controls.dirLight.setAzimuth(value);
});

lightFolder.add(controls, 'dirLightColatitude', 0, 0.5*Math.PI).step(0.1).onChange(function(value) {
    controls.dirLightColatitude = value;
    controls.dirLight.setColatitude(value);
});

//==============================================================================
// Manejador de eventos del mouse.
let drag = false;

let mouseDown = function(e) {
    drag = true;
    aOrbitalCamera.fixInitMovePosition(e);
    aOrbitalCamera.drag(true);
    e.preventDefault();

    return false;
};

let mouseUp = function(_e){
    drag = false;
    aOrbitalCamera.drag(false);
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
            aCrane.extendWire(-0.25);
            break;
        case 'S':
        case 's':
            aCrane.extendWire(0.25);
            break;
        
        // Control de cámara drone.
        case 'ArrowUp':
            aDroneCamera.move(0, 0, +1);
            break;
        case 'ArrowDown':
            aDroneCamera.move(0, 0, -1);
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
            aDroneCamera.rotate(-1);
            break;
        case 'H':
        case 'h':
            aDroneCamera.rotate(+1);
            break;
        default:
            break;
    }
}, false);

document.addEventListener('keyup', (event) => {
    let name = event.key;

    switch (name) {        
        // Control de cámara drone.
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
        case 'T':
        case 't':
        case 'G':
        case 'g':
            aDroneCamera.move(0, 0, 0);
            break;
        case 'F':
        case 'f':
            aDroneCamera.rotate(0);
            break;
        case 'H':
        case 'h':
            aDroneCamera.rotate(0);
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