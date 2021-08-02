//==============================================================================
function createShader(gl, type, source) {
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }
    
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    let success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

//==============================================================================
function reScaleUVBuffer(uvBuffer, rs_x, rs_y) {
    let reScaleBuffer = [];

    for (let i = 0; i < uvBuffer.length; i += 2) {
        reScaleBuffer.push(uvBuffer[i]*rs_x, uvBuffer[i + 1]*rs_y);
    }

    return reScaleBuffer;
}

//==============================================================================