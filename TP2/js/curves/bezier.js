//==============================================================================
class CuadraticBezierCurve {
    constructor(p0, p1, p2) {
        this.p0 = p0;
        this.p1 = p1;
        this.p2 = p2;

        // this.temp = {};
    }

    base0(u) { return (1 - u)**2; }
    dbase0(u) { return -2*(1 - u); }

    // base1(u) { return u*(1 - u); }
    base1(u) { return 2*u*(1 - u); }
    // dbase1(u) { return 1 - 2*u; }
    dbase1(u) { return 2 - 4*u; }
    
    base2(u) { return u**2; }
    dbase2(u) { return 2*u; }

    getLength() {
        return 1;
    }

    fixBinormal(x, y, z) {
        this.binormal = vec3.fromValues(x, y, z);
        vec3.normalize(this.binormal, this.binormal);
    }

    fixTempNormal(x, y, z) {
        this.tempNormal = vec3.fromValues(x, y, z);
        vec3.normalize(this.tempNormal, this.tempNormal);
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
        let x = 2*this.p0[0] - 4*this.p1[0] + 2*this.p2[0];
        let y = 2*this.p0[1] - 4*this.p1[1] + 2*this.p2[1];
        let z = 2*this.p0[2] - 4*this.p1[2] + 2*this.p2[2];
        let out = vec3.create();
        vec3.normalize(out, [x, y, z]);

        return out;
    }

    // getBinormal(u) {
    //     // if (this.binormal) {
    //     //     return this.binormal;
    //     // }

    //     let tan = this.getTangent(u);
    //     let d2 = this.getSecondDerivate(u);
    //     let binormal = vec3.create();
    //     vec3.cross(binormal, tan, d2);
    //     vec3.normalize(binormal, binormal);

    //     return binormal;
    // }

    // getNormal(u) {
    //     let tan = this.getTangent(u);
    //     let binormal = this.getBinormal(u);
        
    //     let normal = vec3.create();
    //     if (this.temp) {
    //         vec3.cross(normal, this.temp, tan);
    //     } else {
    //         vec3.cross(normal, binormal, tan);
    //     }

        
    //     vec3.normalize(normal, normal);

    //     return normal; // Apunta hacia adentro.
    // }

    getBinormal(u) {
        let tan = this.getTangent(u);
        let d2 = this.getSecondDerivate(u);
        let binormal = vec3.create();

        if (this.tempNormal) {
            vec3.cross(binormal, tan, this.tempNormal);
            vec3.normalize(binormal, binormal);
            return binormal;
        }

        if (this.binormal) {
            return this.binormal;
        }
        
        vec3.cross(binormal, tan, d2);
        vec3.normalize(binormal, binormal);

        return binormal;
    }

    getNormal(u) {
        if (this.tempNormal) {
            return this.tempNormal;
        }

        let tan = this.getTangent(u);
        let binormal = this.getBinormal(u);
        let normal = vec3.create();
        vec3.cross(normal, binormal, tan);
        vec3.normalize(normal, normal);

        return normal; // Apunta hacia adentro.
    }
}

//==============================================================================
class CubicBezierCurve {
    constructor(p0, p1, p2, p3) {
        this.p0 = p0;
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
    }

    base0(u) { return (1 - u)**3; }
    dbase0(u) { return -3*(1 - u)**2; }
    ddbase0(u) { return 6*(1 - u); }

    base1(u) { return 3*u*(1 - u)**2; }
    dbase1(u) { return 3 - 12*u + 9*u**2; }
    ddbase1(u) { return -12 + 18*u; }
    
    base2(u) { return 3*(1 - u)*u**2; }
    dbase2(u) { return 6*u -9*u**2; }
    ddbase2(u) { return 6 - 18*u; }

    base3(u) { return u**3; }
    dbase3(u) { return 3*u**2; }
    ddbase3(u) { return 6*u; }

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