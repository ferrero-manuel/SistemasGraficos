//==============================================================================
class CuadraticBSplineCurve {
    constructor(p0, p1, p2) {
        this.p0 = p0;
        this.p1 = p1;
        this.p2 = p2;
        this.binormal = null;
    }

    base0(u) { return 0.5*(1 - u)**2; }
    dbase0(u) { return u - 1; }

    base1(u) { return 0.5 + u*(1 - u); }
    dbase1(u) { return 1 - 2*u; }
    
    base2(u) { return 0.5*u**2; }
    dbase2(u) { return u; }

    // Cantidad de curvas simples de las que esta compuesta.
    getLength() {
        return 1;
    }

    // Fijar la binormal de la curva.
    // Se usa en el caso de concatenar múltiples curvas simples
    // para que la dirección de la normal sea la correcta.
    fixBinormal(x, y, z) {
        this.binormal = vec3.fromValues(x, y, z);
        vec3.normalize(this.binormal, this.binormal);
    }

    getPoint(u) {
        let x = this.base0(u)*this.p0[0] + this.base1(u)*this.p1[0] + this.base2(u)*this.p2[0];
        let y = this.base0(u)*this.p0[1] + this.base1(u)*this.p1[1] + this.base2(u)*this.p2[1];
        let z = this.base0(u)*this.p0[2] + this.base1(u)*this.p1[2] + this.base2(u)*this.p2[2];

        return [x, y, z];
    }

    getTangent(u) {
        let x = this.dbase0(u)*this.p0[0] + this.dbase1(u)*this.p1[0] + this.dbase2(u)*this.p2[0];
        let y = this.dbase0(u)*this.p0[1] + this.dbase1(u)*this.p1[1] + this.dbase2(u)*this.p2[1];
        let z = this.dbase0(u)*this.p0[2] + this.dbase1(u)*this.p1[2] + this.dbase2(u)*this.p2[2];
        let out = vec3.create();
        vec3.normalize(out, [x, y, z]);

        return out;
    }

    getSecondDerivate(_u) {
        let x = this.p0[0] - 2*this.p1[0] + this.p2[0];
        let y = this.p0[1] - 2*this.p1[1] + this.p2[1];
        let z = this.p0[2] - 2*this.p1[2] + this.p2[2];
        let out = vec3.create();
        vec3.normalize(out, [x, y, z]);

        return out;
    }

    getBinormal(u) {
        if (this.binormal) {
            return this.binormal;
        }

        let tan = this.getTangent(u);
        let d2 = this.getSecondDerivate(u);
        let binormal = vec3.create();
        vec3.cross(binormal, tan, d2);
        vec3.normalize(binormal, binormal);

        return binormal;
    }

    getNormal(u) {
        let tan = this.getTangent(u);
        let binormal = this.getBinormal(u);
        let normal = vec3.create();
        vec3.cross(normal, binormal, tan);
        vec3.normalize(normal, normal);

        return normal; // Apunta hacia adentro.
    }
}

//==============================================================================
class CubicBSplineCurve {
    constructor(p0, p1, p2) {
        this.p0 = p0;
        this.p1 = p1;
        this.p2 = p2;
    }

    base0(u) { return (1/6)*(1 - u)**3; }
    dBase0(u) { return -0.5*(1 - u)**2; }
    ddBase0(u) { return 1 - u; }

    base1(u) { return 0.5*u**3 - u**2 + (2/3); }
    dBase1(u) { return 1.5*u**2 - 2*u; }
    ddbase2(u) { return 3*u - 2; }

    base2(u) { return -0.5*u**3 + 0.5*u**2 + 0.5*u + (1/6); }
    dBase2(u) { return -1.5*u**2 + u + 0.5; }
    ddbase2(u) { return -3*u + 1; }

    base3(u) { return (1/6)*u**3; }
    dBase3(u) { return 0.5*u**2; }
    ddbase3(u) { return u; }

    getLength() {
        return 1;
    }

    fixBinormal(x, y, z) {
        this.binormal = vec3.fromValues(x, y, z);
        vec3.normalize(this.binormal, this.binormal);
    }

    getPoint(u) {
        let x = this.base0(u)*this.p0[0] + this.base1(u)*this.p1[0]
                + this.base2(u)*this.p2[0] + this.base3(u)*this.p3[0];
        let y = this.base0(u)*this.p0[1] + this.base1(u)*this.p1[1]
                + this.base2(u)*this.p2[1] + this.base3(u)*this.p3[1];
        let z = this.base0(u)*this.p0[2] + this.base1(u)*this.p1[2]
                + this.base2(u)*this.p2[2] + this.base3(u)*this.p3[2];

        return [x, y, z];
    }

    getTangent(u) {
        let x = this.dbase0(u)*this.p0[0] + this.dbase1(u)*this.p1[0]
                + this.dbase2(u)*this.p2[0] + this.dbase3(u)*this.p3[0];
        let y = this.dbase0(u)*this.p0[1] + this.dbase1(u)*this.p1[1]
                + this.dbase2(u)*this.p2[1] + this.dbase3(u)*this.p3[1];
        let z = this.dbase0(u)*this.p0[2] + this.dbase1(u)*this.p1[2]
                + this.dbase2(u)*this.p2[2] + this.dbase3(u)*this.p3[2];
        let out = vec3.create();
        vec3.normalize(out, [x, y, z]);

        return out;
    }

    getSecondDerivate(u) {
        let x = this.ddbase0(u)*this.p0[0] + this.ddbase1(u)*this.p1[0]
                + this.ddbase2(u)*this.p2[0] + this.ddbase3(u)*this.p3[0];
        let y = this.ddbase0(u)*this.p0[1] + this.ddbase1(u)*this.p1[1]
                + this.ddbase2(u)*this.p2[1] + this.ddbase3(u)*this.p3[1];
        let z = this.ddbase0(u)*this.p0[2] + this.ddbase1(u)*this.p1[2]
                + this.ddbase2(u)*this.p2[2] + this.ddbase3(u)*this.p3[2];
        let out = vec3.create();
        vec3.normalize(out, [x, y, z]);

        return out;
    }

    getBinormal(u) {
        if (this.binormal) {
            return this.binormal;
        }

        let tan = this.getTangent(u);
        let d2 = this.getSecondDerivate(u);
        let binormal = vec3.create();
        vec3.cross(binormal, tan, d2);
        vec3.normalize(binormal, binormal);

        return binormal;
    }

    getNormal(u) {
        let tan = this.getTangent(u);
        let binormal = this.getBinormal(u);
        let normal = vec3.create();
        vec3.cross(normal, binormal, tan);
        vec3.normalize(normal, normal);

        return normal; // Apunta hacia adentro.
    }
}

//==============================================================================