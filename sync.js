/* Fila offline + sincronização com o Supabase.
   Tudo que o piloto faz (check-in, foto, vídeo) entra primeiro numa fila no aparelho (IndexedDB)
   e é enviado quando houver sinal. Nada se perde se a internet cair no meio. */
(function(){
"use strict";
const C = window.CFG;
const LS = {
  get(k){ try{ return localStorage.getItem("iu26:"+k); }catch(e){ return null; } },
  set(k,v){ try{ v==null ? localStorage.removeItem("iu26:"+k) : localStorage.setItem("iu26:"+k, v); }catch(e){} }
};

/* ---------- IndexedDB mínimo ---------- */
let dbp = null;
function db(){
  if (dbp) return dbp;
  dbp = new Promise((res, rej) => {
    const r = indexedDB.open("iu26", 1);
    r.onupgradeneeded = () => { r.result.createObjectStore("queue", {keyPath:"client_id"}); };
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
  return dbp;
}
async function tx(mode, fn){
  const d = await db();
  return new Promise((res, rej) => {
    const t = d.transaction("queue", mode); const s = t.objectStore("queue");
    const out = fn(s);
    t.oncomplete = () => res(out && out.result !== undefined ? out.result : out);
    t.onerror = () => rej(t.error);
  });
}
const qAdd = item => tx("readwrite", s => s.put(item));
const qDel = id => tx("readwrite", s => s.delete(id));
const qAll = () => tx("readonly", s => s.getAll());

/* ---------- identidade do piloto ---------- */
const Pilot = {
  code(){ return LS.get("pilotcode"); },
  name(){ return LS.get("pilotname"); },
  setCode(c){ LS.set("pilotcode", c ? c.trim().toLowerCase() : null); },
  setName(n){ LS.set("pilotname", n ? n.trim().slice(0,40) : null); },
  isPilot(){ return !!LS.get("pilotcode"); }
};
// link de piloto: ...?piloto=CODIGO
try{
  const u = new URL(location.href); const c = u.searchParams.get("piloto");
  if (c){ Pilot.setCode(c); u.searchParams.delete("piloto"); history.replaceState(null, "", u.pathname + u.search + u.hash); }
}catch(e){}

/* ---------- REST ---------- */
function headers(extra){
  const h = { apikey: C.key, Authorization: "Bearer " + C.key };
  if (Pilot.code()) h["x-trip-key"] = Pilot.code();
  return Object.assign(h, extra || {});
}
async function rest(path, opt){
  const r = await fetch(C.url + "/rest/v1/" + path, Object.assign({}, opt, { headers: headers(opt && opt.headers) }));
  if (!r.ok){ const t = await r.text(); const e = new Error(r.status + " " + t); e.status = r.status; throw e; }
  return r.status === 204 ? null : r.json().catch(() => null);
}
async function upload(path, blob, type){
  const r = await fetch(`${C.url}/storage/v1/object/${C.bucket}/${path}`, {
    method: "POST", body: blob, headers: headers({"Content-Type": type, "x-upsert": "false", "cache-control": "31536000"})
  });
  if (r.ok || r.status === 409) return true;           // 409 = já enviado antes
  const t = await r.text();
  if (/already exists|Duplicate/i.test(t)) return true;
  const e = new Error(r.status + " " + t); e.status = r.status; throw e;
}
const publicUrl = path => `${C.url}/storage/v1/object/public/${C.bucket}/${path}`;

/* ---------- fila ---------- */
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2));
const listeners = new Set();
const emit = () => listeners.forEach(f => { try{ f(); }catch(e){} });

async function addCheckin(c){
  const item = { client_id: uid(), type: "checkin", created: Date.now(),
    row: { day: c.day, stop_idx: c.stop_idx, stop_name: c.stop_name, kind: c.kind, pilot: Pilot.name() || "Piloto", note: c.note || null, happened_at: new Date().toISOString() } };
  item.row.client_id = item.client_id;
  await qAdd(item); emit(); flush(); return item;
}
async function addMedia(m){ // m: {day, stop_idx, stop_name, kind, blob, thumb, type, width, height, caption}
  const id = uid();
  const ext = m.kind === "photo" ? "jpg" : (m.type === "video/mp4" ? "mp4" : "mov");
  const base = `${C.folder}/dia-${String(m.day).padStart(2,"0")}/${id}`;
  const item = { client_id: id, type: "media", created: Date.now(), kind: m.kind, blob: m.blob, thumb: m.thumb || null, mime: m.type,
    path: `${base}.${ext}`, thumbPath: m.thumb ? `${base}_t.jpg` : null,
    row: { client_id: id, day: m.day, stop_idx: m.stop_idx, stop_name: m.stop_name, pilot: Pilot.name() || "Piloto", kind: m.kind,
           path: `${base}.${ext}`, width: m.width || null, height: m.height || null, bytes: m.blob.size, caption: m.caption || null, taken_at: new Date().toISOString() } };
  await qAdd(item); emit(); flush(); return item;
}

let flushing = false;
const status = { pending: 0, videosWaiting: 0, lastError: null, lastSync: LS.get("lastsync") };
async function flush(opts){
  opts = opts || {};
  if (flushing || !navigator.onLine) { await refreshCounts(); return; }
  flushing = true; status.lastError = null;
  try{
    const items = (await qAll()).sort((a,b) => a.created - b.created);
    for (const it of items){
      if (it.type === "media" && it.kind === "video" && !opts.videos) continue; // vídeo só quando o piloto manda (Wi-Fi)
      try{
        if (it.type === "checkin"){
          await rest("checkins?on_conflict=client_id", { method:"POST", body: JSON.stringify(it.row),
            headers: {"Content-Type":"application/json", Prefer:"resolution=ignore-duplicates,return=minimal"} });
        } else {
          await upload(it.path, it.blob, it.mime);
          if (it.thumb && it.thumbPath) await upload(it.thumbPath, it.thumb, "image/jpeg");
          await rest("media?on_conflict=client_id", { method:"POST", body: JSON.stringify(it.row),
            headers: {"Content-Type":"application/json", Prefer:"resolution=ignore-duplicates,return=minimal"} });
        }
        await qDel(it.client_id); emit();
      }catch(e){
        status.lastError = (e.status === 401 || e.status === 403 || /row-level security/i.test(e.message)) ? "Código de piloto inválido" : "Sem conexão estável — tentaremos de novo";
        if (e.status === 413 || /too large|exceeded/i.test(e.message)){ status.lastError = "Arquivo grande demais — removido da fila"; await qDel(it.client_id); }
        else break;
      }
    }
    if (!status.lastError){ status.lastSync = new Date().toISOString(); LS.set("lastsync", status.lastSync); }
  } finally { flushing = false; await refreshCounts(); emit(); }
}
async function refreshCounts(){
  try{ const all = await qAll(); status.pending = all.length; status.videosWaiting = all.filter(i => i.type==="media" && i.kind==="video").length; }catch(e){}
}

/* ---------- leitura compartilhada (com cache para offline) ---------- */
const shared = { checkins: [], media: [], messages: [], reactions: {} };
try{ const c = JSON.parse(LS.get("cache") || "{}"); shared.checkins = c.checkins || []; shared.media = c.media || []; shared.messages = c.messages || []; shared.reactions = c.reactions || {}; }catch(e){}
async function pull(){
  if (!navigator.onLine) return;
  try{
    const since = encodeURIComponent(C.since || "2000-01-01");
    const [ck, md, ms, rx] = await Promise.all([
      rest(`checkins?select=client_id,day,stop_idx,stop_name,kind,pilot,note,happened_at&happened_at=gte.${since}&order=happened_at.asc&limit=2000`),
      rest(`media?select=client_id,day,stop_idx,stop_name,pilot,kind,path,width,height,caption,taken_at&taken_at=gte.${since}&order=taken_at.asc&limit=3000`),
      rest(`messages?select=client_id,name,body,from_pilot,created_at&created_at=gte.${since}&order=created_at.desc&limit=300`),
      rest(`reactions?select=media_client_id,emoji&created_at=gte.${since}&limit=10000`)
    ]);
    shared.checkins = ck || []; shared.media = md || []; shared.messages = ms || [];
    const agg = {}; for (const r of (rx || [])){ (agg[r.media_client_id] = agg[r.media_client_id] || {heart:0,clap:0,moto:0})[r.emoji]++; }
    shared.reactions = agg;
    LS.set("cache", JSON.stringify(shared)); emit();
  }catch(e){ /* mantém cache */ }
}
async function pending(){ try{ return await qAll(); }catch(e){ return []; } }
async function removeCheckin(client_id){
  // remove da fila local se ainda não subiu; senão apaga no servidor
  const q = await pending();
  if (q.find(i => i.client_id === client_id)){ await qDel(client_id); emit(); return; }
  await rest("checkins?client_id=eq." + encodeURIComponent(client_id), { method:"DELETE" });
  shared.checkins = shared.checkins.filter(c => c.client_id !== client_id); LS.set("cache", JSON.stringify(shared)); emit();
}
function device(){ let d = LS.get("device"); if (!d){ d = uid(); LS.set("device", d); } return d; }
async function postMessage(name, body){
  const row = { client_id: uid(), name: name.trim().slice(0,40), body: body.trim().slice(0,280), from_pilot: Pilot.isPilot() && !!Pilot.name() };
  try{
    await rest("messages", { method:"POST", body: JSON.stringify(row), headers: {"Content-Type":"application/json", Prefer:"return=minimal"} });
  }catch(e){
    const m = (e.message.match(/"message":"([^"]+)"/) || [])[1];
    throw new Error(m && !/violates|policy/.test(m) ? m : (navigator.onLine ? "Não foi possível enviar agora" : "Sem internet — tente quando tiver sinal"));
  }
  row.created_at = new Date().toISOString(); shared.messages.unshift(row); LS.set("cache", JSON.stringify(shared)); emit();
}
async function deleteMessage(client_id){
  await rest("messages?client_id=eq." + encodeURIComponent(client_id), { method:"DELETE" });
  shared.messages = shared.messages.filter(m => m.client_id !== client_id); LS.set("cache", JSON.stringify(shared)); emit();
}
async function react(media_client_id, emoji){
  const key = "rx:" + media_client_id + ":" + emoji;
  if (LS.get(key)) return false;
  await rest("reactions?on_conflict=media_client_id,emoji,device", { method:"POST", body: JSON.stringify({media_client_id, emoji, device: device()}),
    headers: {"Content-Type":"application/json", Prefer:"resolution=ignore-duplicates,return=minimal"} });
  LS.set(key, "1");
  const r = shared.reactions[media_client_id] = shared.reactions[media_client_id] || {heart:0,clap:0,moto:0}; r[emoji]++;
  LS.set("cache", JSON.stringify(shared)); emit(); return true;
}
const reacted = (id, e) => !!LS.get("rx:" + id + ":" + e);
async function checkCode(code){
  const r = await fetch(C.url + "/rest/v1/rpc/is_pilot", { method:"POST", headers: Object.assign(headers({"Content-Type":"application/json"}), {"x-trip-key": code.trim().toLowerCase()}), body: "{}" });
  return r.ok ? (await r.json()) === true : null;
}

window.addEventListener("online", () => { flush(); pull(); });
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible"){ flush(); pull(); } });
setInterval(() => { if (document.visibilityState === "visible"){ flush(); pull(); } }, 60000);
try{ if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); }catch(e){}

window.SYNC = { Pilot, addCheckin, addMedia, flush, pull, pending, removeCheckin, checkCode, status, shared, publicUrl, onChange: f => listeners.add(f), LS,
  postMessage, deleteMessage, react, reacted };
refreshCounts().then(() => { emit(); flush(); pull(); });
})();
