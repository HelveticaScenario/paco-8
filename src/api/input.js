import {pixWidth, pixHeight, gl} from '../main.js';

export function _onMouseMove(ev) {
  var canvas = gl().canvas;
  var rect = canvas.getBoundingClientRect();
  setMouseX(Math.round((ev.clientX - rect.left) / rect.width * pixWidth()));
  setMouseY(Math.round((ev.clientY - rect.top) / rect.height * pixHeight()));
}

export function isXInScreen(x) {
  return x >= 0 && x < pixWidth();
}

export function isYInScreen(y) {
  return y >= 0 && y < pixHeight();
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

export function _onKeyDown(ev) {
  if (ev.defaultPrevented) {
    return; // Should do nothing if the key event was already consumed.
  }

  console.log(ev.code);

  // Consume the event for suppressing "double action".
  ev.preventDefault();
}

export function _onKeyUp(ev) {

}
