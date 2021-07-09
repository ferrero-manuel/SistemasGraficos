//==============================================================================
// Toma una curva simple o compuesta y la discretiza.
class CurveDiscretizer {
    constructor(curve) {
        this.curve = curve;
    }

    setCurve(curve) {
        this.curve = curve;
    }

    getCurve(numPoints) {
        let step = (this.curve.getLength() / (numPoints - 1))
        let points = [];
        let u = 0.0;
        
        for (let i = 0; i < (numPoints - 1); i++) {
            u = i*step;
            points.push(this.curve.getPoint(u));
        }
        points.push(this.curve.getPoint(this.curve.getLength()));

        return points;
    }

    getTangent(numPoints) {
        let step = (this.curve.getLength() / (numPoints - 1))
        let points = [];
        let u = 0.0;
        
        for (let i = 0; i < (numPoints - 1); i++) {
            u = i*step;
            points.push(this.curve.getTangent(u));
        }
        points.push(this.curve.getTangent(this.curve.getLength()));

        return points;
    }

    getBinormal(numPoints) {
        let step = (this.curve.getLength() / (numPoints - 1))
        let points = [];
        let u = 0.0;
        
        for (let i = 0; i < (numPoints - 1); i++) {
            u = i*step;
            points.push(this.curve.getBinormal(u));
        }
        points.push(this.curve.getBinormal(this.curve.getLength()));

        return points;
    }

    getNormal(numPoints) {
        let step = (this.curve.getLength() / (numPoints - 1))
        let points = [];
        let u = 0.0;
        
        for (let i = 0; i < (numPoints - 1); i++) {
            u = i*step;
            points.push(this.curve.getNormal(u));
        }
        points.push(this.curve.getNormal(this.curve.getLength()));

        return points;
    }
}

//==============================================================================