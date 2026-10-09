const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function createPNG(width, height, drawPixel) {
  const crcTable = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    crcTable[n] = c;
  }
  function crc32(buf) {
    let crc = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xff];
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const typeAndData = Buffer.concat([typeBuf, data]);
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc32(typeAndData), 0);
    return Buffer.concat([len, typeAndData, crcBuf]);
  }

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  const ihdrChunk = makeChunk('IHDR', ihdr);

  const rawData = Buffer.alloc(height * (1 + width * 4));
  let offset = 0;
  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0;
    for (let x = 0; x < width; x++) {
      const rgba = drawPixel(x, y, width, height);
      rawData[offset++] = rgba[0];
      rawData[offset++] = rgba[1];
      rawData[offset++] = rgba[2];
      rawData[offset++] = rgba[3];
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function drawIconPixel(x, y, w, h) {
  const cx = w / 2;
  const cy = h / 2;
  const r = w / 2 - 1;
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist > r) {
    return [0, 0, 0, 0];
  }

  const t = (x + y) / (w + h);
  let rCol = Math.round(99 + (6 - 99) * t);
  let gCol = Math.round(102 + (182 - 102) * t);
  let bCol = Math.round(241 + (212 - 241) * t);

  let alpha = 255;
  if (dist > r - 1) {
    alpha = Math.round(255 * (r - dist));
  }

  const nx = dx / (w * 0.4);
  const ny = dy / (h * 0.4);
  const astroid = Math.pow(Math.abs(nx), 0.5) + Math.pow(Math.abs(ny), 0.5);

  if (astroid <= 0.8) {
    const sparkT = 1 - (astroid / 0.8);
    rCol = Math.round(rCol * (1 - sparkT) + 255 * sparkT);
    gCol = Math.round(gCol * (1 - sparkT) + 255 * sparkT);
    bCol = Math.round(bCol * (1 - sparkT) + 255 * sparkT);
  }

  return [rCol, gCol, bCol, alpha];
}

const iconsDir = path.join(__dirname, 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

[16, 48, 128].forEach(size => {
  const pngBuf = createPNG(size, size, drawIconPixel);
  fs.writeFileSync(path.join(iconsDir, `icon${size}.png`), pngBuf);
  console.log(`Generated icon${size}.png (${size}x${size})`);
});
