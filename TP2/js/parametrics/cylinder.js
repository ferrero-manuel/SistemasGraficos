//==============================================================================
class ParametricCylinder {
    constructor(radius, height) {
        this.radius = radius;
        this.height = height;
    }

    getPosition(uV_u, uV_v) {
        let phi = 2*Math.PI*uV_u;

        return [(this.radius*Math.sin(phi)), (this.height*(uV_v - 0.5)), (this.radius*Math.cos(phi))];
    }

    getNormal(uV_u, uV_v) {
        let positions = this.getPosition(uV_u, uV_v);

        return [positions[0], 0, positions[2]];
    }

    getTextureCoordinates(uV_u, uV_v) {
        return [uV_u, uV_v];
    }
}

//==============================================================================