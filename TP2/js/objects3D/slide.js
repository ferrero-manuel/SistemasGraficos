class Slide {
    constructor(numLaps, shaderProgramColor, shaderProgramTexture, textures, numTexture) {
        this.shaderProgramColor = shaderProgramColor;
        this.shaderProgramTexture = shaderProgramTexture;
        this.textures = textures;
        this.numTexture = numTexture;
        this.numLaps = numLaps;

        this.path = {};
        this.design = {};
        this.object3D = {};

        this.step = 0.4;

        this.slideNode = new Node();

        this.build();
    }

    getNode() {
        return this.slideNode;
    }

    setPosition(x, y, z) {
        this.slideNode.setPosition(x, y, z);
    }

    build() {
        this.slideNode.children = [];

        let width = 2;
        let long = 4;
        let step = this.step;
        let height_level = step*12;

        let aCube = new Cube();
        let aNode = new Node();
        aNode.setShaderProgramTexture(this.shaderProgramTexture, this.textures, this.numTexture);
        aNode.setParent(this.slideNode);
        aNode.setGeometry(aCube);
        aNode.setPosition(2, height_level*this.numLaps/2, 0);
        aNode.setScale(1.5, height_level*this.numLaps, 1.5);

        aNode = new Node();
        aNode.setShaderProgramTexture(this.shaderProgramTexture, this.textures, this.numTexture);
        aNode.setParent(this.slideNode);
        aNode.setGeometry(aCube);
        aNode.setPosition(-2, height_level*this.numLaps/2, 0);
        aNode.setScale(1.5, height_level*this.numLaps, 1.5);
        
        this.path = new MultipleParametricCurve();

        for (let i = 0; i < this.numLaps; i++) {
            this.path.addCurve(new CuadraticBezierCurve([long/2, height_level*i+0, -width], [0, height_level*i+step*1-0.01, -width], [-long/2, height_level*i+step*2, -width]));

            let bezier = new CuadraticBezierCurve([-long/2, height_level*i+step*2, -width], [-long, height_level*i+step*3, -width], [-long, height_level*i+step*4, 0]);
            bezier.fixTempNormal(0,1,0);
            this.path.addCurve(bezier);
            
            bezier = new CuadraticBezierCurve([-long, height_level*i+step*4, 0], [-long, height_level*i+step*5, width], [-long/2, height_level*i+step*6, width]);
            bezier.fixTempNormal(0,1,0);
            this.path.addCurve(bezier);
            
            this.path.addCurve(new CuadraticBezierCurve([-long/2, height_level*i+step*6, width], [0, height_level*i+step*7-0.01, width], [long/2, height_level*i+step*8, width]));
            
            bezier = new CuadraticBezierCurve([long/2, height_level*i+step*8, width], [long, height_level*i+step*9, width], [long, height_level*i+step*10, 0]);
            bezier.fixTempNormal(0,1,0);
            this.path.addCurve(bezier);
            
            bezier = new CuadraticBezierCurve([long, height_level*i+step*10, 0], [long, height_level*i+step*11, -width], [long/2, height_level*i+step*12, -width]);
            bezier.fixTempNormal(0,1,0);
            this.path.addCurve(bezier);
        }
        
        this.aDiscretizerPath = new CurveDiscretizer(this.path);

        this.design = new CubicBezierCurve([0, 1, -1], [0, -1, -1], [0, -1, 1], [0, 1, 1]);
        this.aDiscretizerDesign = new CurveDiscretizer(this.design);

        this.object3D = new ExtrusionSurface(this.aDiscretizerDesign, 10, this.aDiscretizerPath, this.numLaps*50);
        this.object3D.color = [200.0/255.0, 100.0/255.0, 10.0/255.0, 1.0];

        aNode = new Node();
        aNode.setShaderProgram(this.shaderProgramColor, aNode);
        aNode.setParent(this.slideNode);
        aNode.setGeometry(this.object3D);
        aNode.setPosition(0, 0.5, 0);

    }

    setNumLaps(numLaps) {
        this.numLaps = numLaps;

        this.path = {};
        this.design = {};
        this.object3D = {};

        this.build();
    }

    strech(step) {
        this.step = step;

        this.build();
    }
}