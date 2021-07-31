//==============================================================================
// A partir de varias curvas simples de BSpline o Bezier se construye una curva compuesta.
// Los valores permitidos del parámetro son: 0 <= u <= #curvas.
// Soporta curvas simples.
class MultipleParametricCurve {
    constructor() {
        this.curves = [];
    }

    addCurve(curve) {
        this.curves.push(curve);
    }

    getLength() {
        return this.curves.length;
    }

    getPoint(u) {
        if (u < 0 || u > this.curves.length) {
            console.error("Error: Invalid parameter value.");
            return;
        }

        let intPart = Math.floor(u);
        let decimalPart = u - intPart;

        if (intPart == this.curves.length) {
            return this.curves[intPart - 1].getPoint(1.0); 
        }

        return this.curves[intPart].getPoint(decimalPart);
    }

    getTangent(u) {
        if (u < 0 || u > this.curves.length) {
            console.error("Error: Invalid parameter value.");
            return;
        }

        let intPart = Math.floor(u);
        let decimalPart = u - intPart;

        if (intPart == this.curves.length) {
            return this.curves[intPart - 1].getTangent(1.0); 
        }

        return this.curves[intPart].getTangent(decimalPart);
    }

    getBinormal(u) {
        if (u < 0 || u > this.curves.length) {
            console.error("Error: Invalid parameter value.");
            return;
        }

        let intPart = Math.floor(u);
        let decimalPart = u - intPart;

        if (intPart == this.curves.length) {
            return this.curves[intPart - 1].getBinormal(1.0); 
        }

        return this.curves[intPart].getBinormal(decimalPart);
    }

    getNormal(u) {
        if (u < 0 || u > this.curves.length) {
            console.error("Error: Invalid parameter value.");
            return;
        }

        let intPart = Math.floor(u);
        let decimalPart = u - intPart;

        if (intPart == this.curves.length) {
            return this.curves[intPart - 1].getNormal(1.0); 
        }

        return this.curves[intPart].getNormal(decimalPart);
    }
}

//==============================================================================