class CubeMap {
    constructor(faceInfos) {
        this.faceInfos = faceInfos;

        let texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);

        this.faceInfos.forEach((faceInfo) => {
            const {target, url} = faceInfo;
            const level = 0;
            const internalFormat = gl.RGBA;
            const width = 512;
            const height = 512;
            const format = gl.RGBA;
            const type = gl.UNSIGNED_BYTE;

            gl.texImage2D(target, level, internalFormat, width, height, 0, format, type, null);
           
            let image = new Image();
            image.src = url;
            image.addEventListener('load', function() {
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
                gl.texImage2D(target, level, internalFormat, format, type, image);
                gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
            });
        });
        
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

        this.texture = texture;
    }

    getTexture() {
        return this.texture;
    }
}