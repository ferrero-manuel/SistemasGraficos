class Slide {
    constructor() {

        this.path = new MultipleParametricCurve();
        // this.path.addCurve(new CuadraticBezierCurve([4, 0, -4], [0, 0, -4], [-4, 0, -4]));
        // this.path.addCurve(new CuadraticBezierCurve([-4, 0, -4], [-8, 0, -4], [-8, 0, 0]));
        // this.path.addCurve(new CuadraticBezierCurve([-8, 0, 0], [-8, 0, 4], [-4, 0, 4]));
        // this.path.addCurve(new CuadraticBezierCurve([-4, 0, 4], [0, 0, 4], [4, 0, 4]));
        // this.path.addCurve(new CuadraticBezierCurve([4, 0, 4], [8, 0, 4], [8, 0, 0]));
        // this.path.addCurve(new CuadraticBezierCurve([8, 0, 0], [8, 0, -4], [4, 0, -4]));
        // this.aDiscretizerPath = new CurveDiscretizer(this.path);

        // this.design = new CuadraticBezierCurve([1, 0, 1], [-1, 0, 1], [-1, 0, -1], [1, 0, -1]);


        // this.aDiscretizerDesign = new CurveDiscretizer(this.design);

        // let aux = new CubicBezierCurve([4,4,0], [0,-2,0], [-4,4,0], [-8,8,0]);
        let aux = new CubicBezierCurve([1, 1, 0], [1, -1, 0], [-1, -1, 0], [-1, 1, 0]);
        this.aDiscretizerDesign = new CurveDiscretizer(aux);

        this.path.addCurve(new CuadraticBezierCurve([1, 0, 0], [2, 0.1, 1], [3, 0.3, 0]));
        this.path.addCurve(new CuadraticBezierCurve([3, 0.3, 0], [4, 0.5, 0], [5, 0.9, 0]))
        

        this.aDiscretizerPath = new CurveDiscretizer(this.path);
        this.object3D = new ExtrusionSurface(this.aDiscretizerDesign, 40, this.aDiscretizerPath, 80);
    }

    getVertexBuffer() {
        return this.object3D.getVertexBuffer();
    }

    getNormalBuffer() {
        return this.object3D.getNormalBuffer();
    }

    getIndexBuffer() {
        return this.object3D.getIndexBuffer();
    }

    getIndexLength() {
        return this.object3D.getIndexLength();
    }

    getColor() {
        return this.object3D.getColor();
    }

    getDrawMode() {
        return this.object3D.getDrawMode();
    }
}