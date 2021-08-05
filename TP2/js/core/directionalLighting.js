//==============================================================================
class DirectionalLighting {
    constructor(azimuth, colatitude) {
        this.azimuth = azimuth;
        this.colatitude = colatitude;

        // Cota
        if (this.colatitude >= 0.5*Math.PI) {
            this.colatitude = 0.5*Math.PI;
        } else if (this.colatitude < 0.0) {
            this.colatitude = 0.0;
        }

        this.lightDirection = vec3.create();

        this.computeDirectionLight();
    }

    computeDirectionLight() {
        this.lightDirection[0] = Math.sin((this.colatitude)) * Math.cos((this.azimuth));
        this.lightDirection[1] = Math.cos((this.colatitude));
        this.lightDirection[2] = Math.sin((this.colatitude)) * Math.sin((this.azimuth));

        vec3.normalize(this.lightDirection, this.lightDirection);
    }

    setAzimuth(azimuth) {
        this.azimuth = azimuth;
        this.computeDirectionLight();
    }

    setColatitude(colatitude) {
        this.colatitude = colatitude;

        // Cota
        if (this.colatitude >= 0.45*Math.PI) {
            this.colatitude = 0.45*Math.PI;
        } else if (this.colatitude < 0.1) {
            this.colatitude = 0.1;
        }

        this.computeDirectionLight();
    }

    getLightDirection() {
        return this.lightDirection;
    }
}

//==============================================================================