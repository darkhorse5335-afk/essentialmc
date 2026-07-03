/* ================================================
   Minecraft Bookshelf — correct isometric cube
   ================================================ */
(function () {
  const wrap = document.querySelector('.mc-block-wrap');
  if (!wrap) return;

  const S  = 8;   // pixels per MC texel
  const N  = 16;  // texels per face
  const FS = N * S; // 128

  // Isometric projected dimensions
  // top face: each pixel maps to (S, S/2) in screen space
  // front/right: each pixel maps to (S, S) scaled by cos30
  const TX = S;        // x step for right direction
  const TY = S * 0.5;  // y step for right direction (iso)
  const FH = S * 0.86; // front face pixel height

  // Canvas
  const CW = N * TX * 2 + N * TX;      // wide enough
  const CH = N * TY * 2 + N * FH + 40;
  const canvas = document.createElement('canvas');
  canvas.width  = Math.ceil(CW + 60);
  canvas.height = Math.ceil(CH + 40);
  canvas.style.display = 'block';
  canvas.style.imageRendering = 'pixelated';
  wrap.insertBefore(canvas, wrap.firstChild);

  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  /* ── Textures ── */
  const OAK = [
    'c8922a','c8922a','c8922a','c8922a','b87e1e','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','b87e1e','c8922a','c8922a','c8922a','c8922a',
    'c8922a','a86c12','a86c12','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','a86c12','a86c12','c8922a',
    'c8922a','a86c12','a86c12','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','a86c12','a86c12','c8922a',
    'b87e1e','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','b87e1e','b87e1e','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','b87e1e',
    'c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a',
    'c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a',
    'c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','a86c12','c8922a','c8922a','a86c12','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a',
    'c8922a','c8922a','c8922a','b87e1e','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','b87e1e','c8922a','c8922a','c8922a',
    'c8922a','c8922a','c8922a','b87e1e','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','b87e1e','c8922a','c8922a','c8922a',
    'c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','a86c12','c8922a','c8922a','a86c12','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a',
    'c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a',
    'c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a',
    'b87e1e','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','b87e1e','b87e1e','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','b87e1e',
    'c8922a','a86c12','a86c12','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','a86c12','a86c12','c8922a',
    'c8922a','a86c12','a86c12','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','a86c12','a86c12','c8922a',
    'c8922a','c8922a','c8922a','c8922a','b87e1e','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','b87e1e','c8922a','c8922a','c8922a','c8922a',
  ];

  const BOOK_FRONT = [
    'c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a',
    'c8922a','6d1309','6d1309','6d1309','1e2d6b','1e2d6b','1e2d6b','b87e1e','b87e1e','6d2d09','6d2d09','2a4d0e','2a4d0e','5c1a6b','5c1a6b','c8922a',
    'c8922a','8b1a0e','8b1a0e','8b1a0e','2a3a8b','2a3a8b','2a3a8b','c8922a','c8922a','8b3c0e','8b3c0e','3a6b1a','3a6b1a','7c248b','7c248b','c8922a',
    'c8922a','8b1a0e','fafafa','8b1a0e','2a3a8b','fafafa','2a3a8b','c8922a','c8922a','8b3c0e','fafafa','3a6b1a','fafafa','7c248b','fafafa','c8922a',
    'c8922a','8b1a0e','8b1a0e','8b1a0e','2a3a8b','2a3a8b','2a3a8b','c8922a','c8922a','8b3c0e','8b3c0e','3a6b1a','3a6b1a','7c248b','7c248b','c8922a',
    'c8922a','6d1309','6d1309','6d1309','1e2d6b','1e2d6b','1e2d6b','b87e1e','b87e1e','6d2d09','6d2d09','2a4d0e','2a4d0e','5c1a6b','5c1a6b','c8922a',
    '5c3a0a','5c3a0a','5c3a0a','5c3a0a','5c3a0a','5c3a0a','5c3a0a','5c3a0a','5c3a0a','5c3a0a','5c3a0a','5c3a0a','5c3a0a','5c3a0a','5c3a0a','5c3a0a',
    'c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a',
    'c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a',
    '5c3a0a','5c3a0a','5c3a0a','5c3a0a','5c3a0a','5c3a0a','5c3a0a','5c3a0a','5c3a0a','5c3a0a','5c3a0a','5c3a0a','5c3a0a','5c3a0a','5c3a0a','5c3a0a',
    'c8922a','3a1a6b','3a1a6b','3a1a6b','8b3c0e','8b3c0e','8b3c0e','c8922a','c8922a','6d1309','6d1309','1e2d6b','1e2d6b','2a4d0e','2a4d0e','c8922a',
    'c8922a','4a248b','4a248b','4a248b','a86214','a86214','a86214','c8922a','c8922a','8b1a0e','8b1a0e','2a3a8b','2a3a8b','3a6b1a','3a6b1a','c8922a',
    'c8922a','4a248b','fafafa','4a248b','a86214','fafafa','a86214','c8922a','c8922a','8b1a0e','fafafa','2a3a8b','fafafa','3a6b1a','fafafa','c8922a',
    'c8922a','4a248b','4a248b','4a248b','a86214','a86214','a86214','c8922a','c8922a','8b1a0e','8b1a0e','2a3a8b','2a3a8b','3a6b1a','3a6b1a','c8922a',
    'c8922a','3a1a6b','3a1a6b','3a1a6b','8b3c0e','8b3c0e','8b3c0e','c8922a','c8922a','6d1309','6d1309','1e2d6b','1e2d6b','2a4d0e','2a4d0e','c8922a',
    'c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a','c8922a',
  ];

  const OAK_DARK = OAK.map(c => {
    const r = parseInt(c.slice(0,2),16);
    const g = parseInt(c.slice(2,4),16);
    const b = parseInt(c.slice(4,6),16);
    return [r,g,b].map(v=>Math.round(v*0.65).toString(16).padStart(2,'0')).join('');
  });

  /* ── True isometric cube renderer ──
     Origin = top-left corner of cube in screen space
     
     Isometric axes:
       right  (+X): screen( TX,  TY) per texel
       into   (+Z): screen(-TX,  TY) per texel  
       down   (+Y): screen(  0,  FH) per texel
  */

  // Place cube so it's nicely centered
  // Top-left corner of cube top face (screen coords)
  function drawCube(originX, originY) {

    // ── TOP FACE ── (xy plane, looking down)
    // pixel (px, py) in texture → screen pos:
    //   x = originX + px*TX + py*(-TX)  → not quite, need proper iso
    // For standard 2:1 isometric:
    //   right dir = (+TX, +TY), depth dir = (-TX, +TY)
    for (let py = 0; py < N; py++) {
      for (let px = 0; px < N; px++) {
        const col = OAK[py * N + px];
        const sx = originX + px * TX - py * TX;
        const sy = originY + px * TY + py * TY;
        ctx.fillStyle = '#' + col;
        ctx.fillRect(sx, sy, TX + 1, TY + 1);
      }
    }

    // Bottom-left of top face = start of FRONT face
    // Front face bottom-left corner in screen:
    const frontOriginX = originX - N * TX;  // leftmost point of top
    const frontOriginY = originY + N * TY;  // bottom of top face

    // ── FRONT FACE ── (left side, facing viewer)
    // pixel (px, py): right = (+TX,0), down = (0,+FH)
    for (let py = 0; py < N; py++) {
      for (let px = 0; px < N; px++) {
        const col = BOOK_FRONT[py * N + px];
        const sx = frontOriginX + px * TX;
        const sy = frontOriginY + py * FH;
        ctx.fillStyle = '#' + col;
        ctx.fillRect(sx, sy, TX + 1, Math.ceil(FH) + 1);
      }
    }

    // ── RIGHT FACE ── (right side, darker)
    // Starts at rightmost top edge
    const rightOriginX = originX;  // right top corner
    const rightOriginY = originY + N * TY;

    for (let py = 0; py < N; py++) {
      for (let px = 0; px < N; px++) {
        const col = OAK_DARK[py * N + px];
        const sx = rightOriginX - px * TX;
        const sy = rightOriginY + px * TY + py * FH;
        ctx.fillStyle = '#' + col;
        ctx.fillRect(sx, sy, TX + 1, Math.ceil(FH) + 1);
      }
    }
  }

  // Glow on hover
  let glowing = false, glowAlpha = 0;
  wrap.addEventListener('mouseenter', () => { glowing = true; });
  wrap.addEventListener('mouseleave', () => { glowing = false; });

  let t = 0;
  (function loop() {
    requestAnimationFrame(loop);
    t += 0.018;

    glowAlpha += ((glowing ? 1 : 0) - glowAlpha) * 0.07;
    glowAlpha = Math.max(0, Math.min(1, glowAlpha));

    const floatY = Math.sin(t * 0.8) * 6;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Glow
    if (glowAlpha > 0.01) {
      const cx = canvas.width * 0.5;
      const cy = canvas.height * 0.5 + floatY;
      const grd = ctx.createRadialGradient(cx, cy, 20, cx, cy, 140);
      grd.addColorStop(0,   `rgba(255,190,60,${glowAlpha * 0.45})`);
      grd.addColorStop(0.5, `rgba(255,130,20,${glowAlpha * 0.18})`);
      grd.addColorStop(1,   'rgba(255,100,0,0)');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Cube origin — top point of top face
    const ox = Math.round(canvas.width  * 0.5);
    const oy = Math.round(canvas.height * 0.18 + floatY);
    drawCube(ox, oy);

  })();
})();
