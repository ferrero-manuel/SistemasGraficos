//==============================================================================
class TextureUnits {
    constructor() {
        this.textures = [];
    }

    addTexture(image) {
        let texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                        new Uint8Array([0, 0, 255, 255]));

        let aImage = new Image();
        aImage.src = image;

        aImage.addEventListener('load', function() {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, aImage);
            gl.generateMipmap(gl.TEXTURE_2D);
        });

        this.textures.push(texture);

        return texture;
    }
}

//==============================================================================