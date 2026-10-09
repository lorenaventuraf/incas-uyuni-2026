/* Fotos: redução no próprio celular, miniatura, moldura da expedição e compartilhamento. */
(function(){
"use strict";
const logo = new Image(); logo.src = "img/nodedata-logo.png";
const emblem = new Image(); let emblemOk = false;
emblem.onload = () => emblemOk = true; emblem.src = "img/selo.png"; // opcional: entra quando o selo existir

function loadImage(file){
  return new Promise((res, rej) => {
    const url = URL.createObjectURL(file); const im = new Image();
    im.onload = () => { res(im); setTimeout(() => URL.revokeObjectURL(url), 1000); };
    im.onerror = () => { URL.revokeObjectURL(url); rej(new Error("Não consegui abrir esta foto")); };
    im.src = url;
  });
}
function toBlob(canvas, q){ return new Promise(r => canvas.toBlob(r, "image/jpeg", q)); }
function scaled(im, max){
  const w = im.naturalWidth, h = im.naturalHeight, k = Math.min(1, max / Math.max(w, h));
  const c = document.createElement("canvas"); c.width = Math.round(w*k); c.height = Math.round(h*k);
  const g = c.getContext("2d"); g.imageSmoothingQuality = "high"; g.drawImage(im, 0, 0, c.width, c.height);
  return c;
}
async function processPhoto(file){
  const im = await loadImage(file);
  const big = scaled(im, 2048), small = scaled(im, 480);
  return { blob: await toBlob(big, 0.84), thumb: await toBlob(small, 0.72), width: big.width, height: big.height };
}

/* Moldura: faixa escura fina na base (≈7% da altura), sem cobrir a foto. */
function drawFrame(g, W, H, info){
  const sh = Math.max(56, Math.round(Math.min(W, H) * 0.085));
  const y = H - sh, pad = Math.round(sh * 0.32);
  const grad = g.createLinearGradient(0, y - sh*0.6, 0, H);
  grad.addColorStop(0, "rgba(14,18,24,0)"); grad.addColorStop(0.38, "rgba(14,18,24,.62)"); grad.addColorStop(1, "rgba(14,18,24,.86)");
  g.fillStyle = grad; g.fillRect(0, y - sh*0.6, W, sh*1.6);
  let x = pad;
  if (emblemOk){ const s = sh*0.82; g.drawImage(emblem, x, y + (sh - s)/2, s, s); x += s + pad*0.6; }
  else { // marcador simples: montanhas
    const s = sh*0.5, by = y + sh*0.72; g.strokeStyle = "#d9a441"; g.lineWidth = Math.max(2, sh*0.05); g.lineJoin = "round";
    g.beginPath(); g.moveTo(x, by); g.lineTo(x+s*0.35, by-s*0.62); g.lineTo(x+s*0.55, by-s*0.32); g.lineTo(x+s*0.75, by-s*0.8); g.lineTo(x+s*1.1, by); g.stroke();
    x += s*1.1 + pad*0.7;
  }
  g.textBaseline = "alphabetic"; g.fillStyle = "#fff";
  g.font = `700 ${Math.round(sh*0.34)}px Poppins, "Helvetica Neue", Arial, sans-serif`;
  g.fillText(info.title.toUpperCase(), x, y + sh*0.52);
  g.fillStyle = "rgba(255,255,255,.78)";
  g.font = `500 ${Math.round(sh*0.22)}px Inter, "Helvetica Neue", Arial, sans-serif`;
  g.fillText(info.sub, x, y + sh*0.84);
  if (logo.complete && logo.naturalWidth){
    const lh = sh*0.3, lw = lh * logo.naturalWidth / logo.naturalHeight;
    g.globalAlpha = 0.85; g.drawImage(logo, W - pad - lw, y + (sh - lh)/2 + sh*0.06, lw, lh); g.globalAlpha = 1;
  }
}
async function framed(url, info){
  const im = await new Promise((res, rej) => { const i = new Image(); i.crossOrigin = "anonymous"; i.onload = () => res(i); i.onerror = rej; i.src = url; });
  const c = document.createElement("canvas"); c.width = im.naturalWidth; c.height = im.naturalHeight;
  const g = c.getContext("2d"); g.drawImage(im, 0, 0); drawFrame(g, c.width, c.height, info);
  return toBlob(c, 0.9);
}
async function share(url, info, filename){
  const blob = await framed(url, info);
  const file = new File([blob], filename, {type:"image/jpeg"});
  if (navigator.canShare && navigator.canShare({files:[file]})){
    try{ await navigator.share({files:[file], text: info.title + " — " + info.sub}); return "shared"; }
    catch(e){ if (e.name === "AbortError") return "cancel"; }
  }
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = filename; document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 2000);
  return "downloaded";
}
window.MEDIA = { processPhoto, framed, share, drawFrame };
})();
