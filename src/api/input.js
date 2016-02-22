import {pixWidth, pixHeight} from '../main.js';

export function _onMouseMove(ev) {
  var canvas = ev.target;
  var rect = canvas.getBoundingClientRect();
  setMouseX(Math.round((ev.clientX - rect.left) / rect.width * pixWidth()));
  setMouseY(Math.round((ev.clientY - rect.top) / rect.height * pixHeight()));
}

let _mouseX = -1;
function setMouseX(x) {
  _mouseX = x;
}
export function mouseX() {
  return _mouseX;
}

let _mouseY = -1;
function setMouseY(y) {
  _mouseY = y;
}
export function mouseY() {
  return _mouseY;
}

let _buttons = 0;
export function _onMouseDown(ev) {
  _buttons = ev.buttons;
}

export function _onMouseUp(ev) {
  if (_buttons !== 0) {
    _buttons = ev.buttons;
  }
}

export function mouseBtn(idx) {
  return (_buttons & (1 << idx)) !== 0;
}
