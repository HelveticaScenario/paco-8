/*
:: Base ram memory layout
	0x0    gfx
	0x1000 gfx2/map2 (shared)
	0x2000 map
	0x3000 gfx_props
	0x3100 song
	0x3200 sfx
	0x4300 user data
	0x5e00 persistent cart data
	0x5f00 draw state (+ unused)
	0x6000 screen (8k)

	User data has no particular meaning and can be used for anything via memcpy(), peek() & poke().
	Persistent cart data is mapped to 0x5e00..0x5eff but only stored if cartdata() has been called.
	Colour format (gfx/screen) is 2 pixels per byte: low bits encode the left pixel of each pair.
	Map format is one byte per cel, where the byte normally encodes a sprite index.
*/

const kb = 1024;
const baseRam = new ArrayBuffer(32 * kb);
const baseRamArray = new Uint8ClampedArray(baseRam);
const cartRom = new ArrayBuffer(0x4300);
const cartRomArray = new Uint8ClampedArray(cartRom);

export function peek(addr) {
  if (addr >= 0 && addr < 32*kb) {
    return baseRamArray[Math.floor(addr)];
  } else {
    throw new RangeError(`addr must meet the condition: 0 <= addr < ${32 * 1024}, was ${addr}`);
  }
}

export function poke(addr, val) {
  if (addr >= 0 && addr < 32*kb && val >= 0 && val < 256) {
    baseRamArray[Math.floor(addr)] = Math.floor(val);
  } else {
    throw new RangeError(`addr, val must meet the condition: 0 <= addr < ${32 * 1024}, 0 <= val < 256, were ${addr} ${val}`);
  }
}

export function memcpy(dest_addr, source_addr, len) {
  dest_addr = Math.floor(dest_addr);
  source_addr = Math.floor(source_addr);
  len = Math.floor(len);
  if (
    source_addr >= 0 && source_addr < 32*kb &&
    dest_addr >= 0 && dest_addr < 32*kb &&
    len >= 0 && len < 32*kb &&
    len <= (32*kb)-source_addr
  ) {
    baseRamArray.copyWithin(dest_addr, source_addr, source_addr + len);
  } else {
    throw new RangeError(`dest_addr, source_addr, len must meet the condition:
0 <= dest_addr < ${32 * 1024},
0 <= source_addr < ${32 * 1024},
0 <= len < ${32 * 1024},
0 <= (len + source_addr) < ${32 * 1024},
were ${dest_addr} ${source_addr} ${len}`);
  }
}

export function reload(dest_addr, source_addr, len) {
  dest_addr = Math.floor(dest_addr);
  source_addr = Math.floor(source_addr);
  len = Math.floor(len);
  if (
    source_addr >= 0 && source_addr < 0x4300 &&
    dest_addr >= 0 && dest_addr < 32*kb &&
    len >= 0 && len < 0x4300 &&
    len <= (0x4300)-source_addr &&
    len <= (32*kb)-dest_addr
  ) {
    baseRamArray.set(cartRomArray.subarray(source_addr, source_addr + len), dest_addr);
  } else {
    throw new RangeError(`dest_addr, source_addr, len must meet the condition:
0 <= dest_addr < ${32 * 1024},
0 <= source_addr < ${0x4300},
0 <= len < ${0x4300},
0 <= (len + dest_addr) < ${32 * 1024},
0 <= (len + source_addr) < ${0x4300},
were ${dest_addr} ${source_addr} ${len}`);
  }
}

export function cstore(dest_addr, source_addr, len) {
  if (dest_addr === undefined && source_addr === undefined && len === undefined) {
    dest_addr = 0;
    source_addr = 0;
    len = 0x4300;
  } else {
    dest_addr = Math.floor(dest_addr);
    source_addr = Math.floor(source_addr);
    len = Math.floor(len);
  }
  if (
    source_addr >= 0 && source_addr < 32*kb &&
    dest_addr >= 0 && dest_addr < 0x4300 &&
    len >= 0 && len < 0x4300 &&
    len <= (0x4300)-dest_addr &&
    len <= (32*kb)-source_addr
  ) {
    cartRomArray.set(baseRamArray.subarray(source_addr, source_addr + len), dest_addr);
  } else {
    throw new RangeError(`dest_addr, source_addr, len must meet the condition:
0 <= dest_addr < ${0x4300},
0 <= source_addr < ${32 * 1024},
0 <= len < ${0x4300},
0 <= (len + dest_addr) < ${0x4300},
0 <= (len + source_addr) < ${32 * 1024},
were ${dest_addr} ${source_addr} ${len}`);
  }
}

export function memset(dest_addr, val, len) {
  dest_addr = Math.floor(dest_addr);
  val = Math.floor(val);
  len = Math.floor(len);
  if (
    dest_addr >= 0 && dest_addr < (32*kb) &&
    len >= 0 && len < (32*kb) &&
    len <= (32*kb)-dest_addr &&
    val >= 0 && val < 256
  ) {
    baseRamArray.fill(val, dest_addr, dest_addr + len);
  } else {
    throw new RangeError(`dest_addr, val, len must meet the condition:
0 <= dest_addr < ${32 * 1024},
0 <= len < ${32 * 1024},
0 <= (len + dest_addr) < ${32 * 1024},
0 <= val < 256,
were ${dest_addr} ${val} ${len}`);
  }
}
