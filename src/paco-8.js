import {start} from './main.js';

window.paco_8 = {
  init(canvas, config) {
    start(canvas, {
      pixWidth: 128,
      pixHeight: 128,
      ...config,
    });
  }
};
