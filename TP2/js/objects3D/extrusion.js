//==============================================================================
// Genera una superficie de extrusión a partir de:
// *un diseño representado por una curva parámetrica.
// *un camino representado por una curva parámetrica.
// (Ambas deben ser de la clase MultiParametricCurve).
class ExtrusionSurface {
    constructor(design, n_design, path, n_path) {
        this.design = design; // Curva a extruir.
        this.n_design = n_design; // Cantidad de puntos del diseño.
        this.path = path // Camino.
        this.n_path = n_path; // Cantidad tramos discretos del camino.

        this.vertexBuffer = [];
        this.normalBuffer = [];
        this.indexBuffer = [];
        this.color = [0.5, 0.5, 0.5, 1];
        this.glDrawMode = gl.TRIANGLE_STRIP;

        this.extrude();
    }

    extrude() {
        // Obtener puntos discretizados de la curva a extruir.
        let design_points = this.design.getCurve(this.n_design);
        let design_normal = this.design.getNormal(this.n_design);
        // Obtener puntos discretizados del camino.
        let path_points = this.path.getCurve(this.n_path);
        let path_tangent = this.path.getTangent(this.n_path);
        let path_binormal = this.path.getBinormal(this.n_path);
        let path_normal = this.path.getNormal(this.n_path);

        let P, N, B, T, levelMatrix, normalMatrix, vctr;
        // Se recorre cada punto del camino.
        for (let i = 0; i < path_points.length; i++) {
            P = path_points[i];
            N = path_normal[i];
            B = path_binormal[i];
            T = path_tangent[i];
            
            levelMatrix = mat4.fromValues(T[0], T[1], T[2], 0, N[0], N[1], N[2], 0,
                                            B[0], B[1], B[2], 0, P[0], P[1], P[2], 1);
            
            normalMatrix = mat4.fromValues(T[0], T[1], T[2], 0, N[0], N[1], N[2], 0,
                                            B[0], B[1], B[2], 0, 0, 0, 0, 1);

            for (let j = 0; j < design_points.length; j++) {
                vctr = vec3.fromValues(design_points[j][0], design_points[j][1], design_points[j][2]);
                vec3.transformMat4(vctr, vctr, levelMatrix);
                this.vertexBuffer.push(vctr[0], vctr[1], vctr[2]);

                vctr = vec3.fromValues(design_normal[j][0], design_normal[j][1], design_points[j][2]);  
                vec3.transformMat4(vctr, vctr, normalMatrix);
                this.normalBuffer.push(vctr[0], vctr[1], vctr[2]);
            }
        }

        let rows = this.n_path - 1;
        let cols = this.n_design - 1;
        for (let i = 0; i < rows; i++) {
            this.indexBuffer.push(i*(cols + 1));
    
            for (let j = 0; j <= cols; j++) {
                this.indexBuffer.push(i*(cols + 1) + j);
                this.indexBuffer.push((i + 1)*(cols + 1) + j);            
            }
            this.indexBuffer.push((i + 1)*(cols + 1) + cols);
        }
    }

    getVertexBuffer() {
        return this.vertexBuffer;
    }

    getNormalBuffer() {
        return this.normalBuffer;
    }

    getIndexBuffer() {
        return this.indexBuffer;
    }

    getIndexLength() {
        return this.indexBuffer.length;
    }

    getColor() {
        return this.color;
    }

    getDrawMode() {
        return this.glDrawMode;
    }
}

//==============================================================================