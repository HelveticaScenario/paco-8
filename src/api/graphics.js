import twgl from 'twgl.js';
import {pixHeight, pixWidth, screenBuffer} from '../main.js';
import {peek, poke, memcpy, memset} from './memory.js';
import {getHigh4Bits, getLow4Bits, combineHighLow} from '../utils.js';

export function makeColor(r, g, b) {
	return Uint8Array.of(r, g, b);
}

function getPixIdx(x, y) {
	return (x + ((pixHeight() - y - 1) * pixWidth()));
}

export function pget(x, y) {
	const pixIdx = getPixIdx(x, y);
	if (pixIdx % 2 === 0) {
		return getLow4Bits(peek((pixIdx/2) + 0x6000));
	} else {
		return getHigh4Bits(peek(Math.floor(pixIdx/2) + 0x6000));
	}
}

export function pset(x, y, col) {
	if (x < 0 || x >= pixWidth() || y < 0 || y >= pixHeight()) {
  	return;
  }
	const pixIdx = getPixIdx(x, y);
	col = getColor(col);
  if (x % 2 === 0) {
  	poke(Math.floor(pixIdx/2) + 0x6000, combineHighLow(getHigh4Bits(peek(Math.floor(pixIdx/2) + 0x6000)), col));
  } else {
		poke(Math.floor(pixIdx/2) + 0x6000, combineHighLow(col, getLow4Bits(peek(Math.floor(pixIdx/2) + 0x6000))));
	}
}

export function rectfill(x0, y0, x1, y1, col) {
	if (x0 > x1) {
  	[x0, x1] = [x1, x0];
  }
  if (y0 > y1) {
  	[y0, y1] = [y1, y0];
  }
	col = getColor(col);
	for(let x = x0; x < x1; x++) {
  	for(let y = y0; y < y1; y++) {
    	pset(x, y, col);
    }
  }
}

export function rect(x0, y0, x1, y1, col) {
	if (x0 > x1) {
  	[x0, x1] = [x1, x0];
  }
  if (y0 > y1) {
  	[y0, y1] = [y1, y0];
  }
	col = getColor(col);
  for(let x = x0; x <= x1; x++) {
  	pset(x, y0, col);
    pset(x, y1, col);
  }
  for(let y = y0; y <= y1; y++) {
  	pset(x0, y, col);
    pset(x1, y, col);
  }
}

export function circ(x, y, r, col) {
  var offx = r;
  var offy = 0;
  var decisionOver2 = 1 - offx;   // Decision criterion divided by 2 evaluated at x=r, y=0
	col = getColor(col);
  while( offy <= offx )
  {
    pset( offx + x,  offy + y, col); // Octant 1
    pset( offy + x,  offx + y, col); // Octant 2
    pset(-offx + x,  offy + y, col); // Octant 4
    pset(-offy + x,  offx + y, col); // Octant 3
    pset(-offx + x, -offy + y, col); // Octant 5
    pset(-offy + x, -offx + y, col); // Octant 6
    pset( offx + x, -offy + y, col); // Octant 7
    pset( offy + x, -offx + y, col); // Octant 8
    offy++;
    if (decisionOver2<=0)
    {
      decisionOver2 += 2 * offy + 1;   // Change in decision criterion for y -> y+1
    }
    else
    {
      offx--;
      decisionOver2 += 2 * (offy - offx) + 1;   // Change for y -> y+1, x -> x-1
    }
  }
}

export function circfill(x, y, r, col) {
  var offx = r;
  var offy = 0;
  var decisionOver2 = 1 - offx;   // Decision criterion divided by 2 evaluated at x=r, y=0
	col = getColor(col);
  while( offy <= offx )
  {
    line( offx + x,  offy + y,-offx + x,  offy + y, col); // Octant 1
    line( offy + x,  offx + y,-offy + x,  offx + y, col); // Octant 2
    line(-offx + x, -offy + y, offx + x, -offy + y, col); // Octant 5
    line(-offy + x, -offx + y, offy + x, -offx + y, col); // Octant 6
    offy++;
    if (decisionOver2<=0)
    {
      decisionOver2 += 2 * offy + 1;   // Change in decision criterion for y -> y+1
    }
    else
    {
      offx--;
      decisionOver2 += 2 * (offy - offx) + 1;   // Change for y -> y+1, x -> x-1
    }
  }
}

export function line(x0, y0, x1, y1, col){
   var dx = Math.abs(x1-x0);
   var dy = Math.abs(y1-y0);
   var sx = (x0 < x1) ? 1 : -1;
   var sy = (y0 < y1) ? 1 : -1;
   var err = dx-dy;
	 col = getColor(col);
   while(true){
     pset(x0,y0,col);

     if ((x0==x1) && (y0==y1)) break;
     var e2 = 2*err;
     if (e2 >-dy){ err -= dy; x0  += sx; }
     if (e2 < dx){ err += dx; y0  += sy; }
   }
}

export function cls() {
	memset(0x6000, 0, 128*64);
}

const BLACK = makeColor(0,0,0);
const palette = [
	BLACK, // 0 black
	makeColor(29,43,83), // 1 dark blue
	makeColor(126,37,83), // 2 dark purple
	makeColor(0,135,81), // 3 dark green
	makeColor(171,82,54), // 4 brown
	makeColor(95,87,79), // 5 dark gray
	makeColor(194,195,199), // 6 light gray
	makeColor(255,241,232), // 7 white
	makeColor(255,0,77), // 8 red
	makeColor(255,263,0), // 9 range
	makeColor(255,240,36), // 10 yellow
	makeColor(0,231,86), // 11 green
	makeColor(41,173,255), // 12 blue
	makeColor(131,118,156), // 13 indigo
	makeColor(255,119,168), // 14 pink
	makeColor(255,204,170) // 15 peach
];

let _defaultColor = 0;

export function color(col) {
	if (col >= 0 && col < 16) {
		_defaultColor = col;
	} else {
		throw new Error(`idx ${col} out of bounds`);
	}
}

function getColor(idx) {
	if (idx >= 0 && idx < 16) {
		return idx;
	} else {
		return _defaultColor;
	}
}

export function _getColor(idx) {
	return palette[idx];
}
