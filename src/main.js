import twgl from 'twgl.js';
import {cls, circ, pset} from './api/graphics.js';
import {getRandomNumber} from './utils.js';

export function start(canvas, config) {
  gl(canvas);
  programInfo();
  bufferInfo();
  pixWidth(config.pixWidth);
  pixHeight(config.pixHeight);
  screenBuffer();
  texture();
  updateOptions();
  uniforms();
  requestAnimationFrame(render);
}

let _gl;
export function gl(canvas) {
  if (!_gl) {
    _gl = twgl.getWebGLContext(document.getElementById(canvas));
  }
  return _gl;
}

let _programInfo;
export function programInfo() {
  if (!_programInfo) {
    _programInfo = twgl.createProgramInfo(gl(), [`
    	attribute vec2 a_position;
      attribute vec2 a_texCoord;

    	varying vec2 v_texCoord;

      void main() {
      	v_texCoord = a_texCoord;
        gl_Position = vec4(a_position, 0, 1);
      }
    `, `
    	precision mediump float;
    	// our texture
      uniform sampler2D u_image;

      // the texCoords passed in from the vertex shader.
      varying vec2 v_texCoord;

      void main() {
         // Look up a color from the texture.
         gl_FragColor = texture2D(u_image, v_texCoord);
      }
    `]);
  }
  return _programInfo;
}

let _bufferInfo;
export function bufferInfo() {
  if (!_bufferInfo) {
    _bufferInfo = twgl.createBufferInfoFromArrays(gl(), {
      a_position: {
      	numComponents: 2,
      	data:[
          -1.0, -1.0,
          1.0, -1.0,
          -1.0,  1.0,
          -1.0,  1.0,
          1.0, -1.0,
          1.0,  1.0
        ]
      },
      a_texCoord: {
      	numComponents: 2,
        data: [
          0.0,  0.0,
          1.0,  0.0,
          0.0,  1.0,
          0.0,  1.0,
          1.0,  0.0,
          1.0,  1.0
        ]
      }
    });
  }
  return _bufferInfo;
}

let _pixWidth;
export function pixWidth(w) {
  if (_pixWidth == null && w != null) {
    _pixWidth = w;
  }
  return _pixWidth;
}

let _pixHeight;
export function pixHeight(h) {
  if (_pixHeight == null && h != null) {
    _pixHeight = h;
  }
  return _pixHeight;
}

let _screenBuffer;
export function screenBuffer() {
  if (!_screenBuffer) {
    _screenBuffer = new Uint8Array(pixWidth() * pixHeight() * 3);
  }
  return _screenBuffer;
}

let _texture;
export function texture() {
  if (!_texture) {
    _texture = twgl.createTexture(gl(), {
      mag: gl().NEAREST,
      min: gl().LINEAR,
      format: gl().RGB,
      width: pixWidth(),
      height: pixHeight(),
      src: screenBuffer(),
    });
  }
  return _texture;
}

let _updateOptions;
export function updateOptions() {
  if (!_updateOptions) {
    _updateOptions = {
      format: gl().RGB,
      width: pixWidth(),
      height: pixHeight(),
    };
  }
  return _updateOptions;
}

let _uniforms;
export function uniforms() {
  if (!_uniforms) {
    _uniforms = {
      u_image: texture()
    };
  }
  return _uniforms;
}

function render(time) {
  const gl_ = gl();
  const programInfo_ = programInfo();
  const bufferInfo_ = bufferInfo();
  const uniforms_ = uniforms();
  const pixWidth_ = pixWidth();
  const pixHeight_ = pixHeight();
  twgl.resizeCanvasToDisplaySize(gl_.canvas, window.devicePixelRatio);
  gl_.viewport(0, 0, gl_.canvas.width, gl_.canvas.height);
  cls();
  for (let x = 0; x < pixWidth_; x++) {
    for (let y = 0; y < pixHeight_; y++) {
      pset(x, y, getRandomNumber(15));
    }
  }
  flip();

  gl_.useProgram(programInfo_.program);
  twgl.setBuffersAndAttributes(gl_, programInfo_, bufferInfo_);
  twgl.setUniforms(programInfo_, uniforms_);
  twgl.drawBufferInfo(gl_, gl_.TRIANGLES, bufferInfo_);

  requestAnimationFrame(render);
}

export function flip() {
	twgl.setTextureFromArray(gl(), texture(), screenBuffer(), updateOptions());
}
