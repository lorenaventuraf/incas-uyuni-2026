(function(){
"use strict";
const T = window.TRIP, DAYS = T.days;
const R = (window.ROUTES && window.ROUTES.lines) ? window.ROUTES : null;
const PROF = {
  long:{c:"#ad3a2c",l:"Etapa longa"}, border:{c:"#b8892b",l:"Dia de fronteira"}, altitude:{c:"#1f5c5e",l:"Ganho de altitude"},
  mountain:{c:"#1c2530",l:"Estrada técnica de montanha"}, remote:{c:"#1f5c5e",l:"Altitude e trecho remoto"},
  recovery:{c:"#6b7a52",l:"Etapa de recuperação"}, moderate:{c:"#6b7a52",l:"Etapa moderada"}, off:{c:"#9c8763",l:"Dia livre"}
};
const CC = {
  BR:{fuel:"posto de combustível",hotel:"hotel com estacionamento",mec:"mecânica de motos",farm:"farmácia",hosp:"hospital",rest:"restaurante",lang:"pt-BR",gl:"BR",ceid:"BR:pt-419"},
  PE:{fuel:"grifo",hotel:"hotel con cochera",mec:"taller de motos",farm:"farmacia",hosp:"hospital",rest:"restaurante",lang:"es-419",gl:"PE",ceid:"PE:es-419"},
  BO:{fuel:"surtidor gasolina",hotel:"hotel con garaje",mec:"taller de motos",farm:"farmacia",hosp:"hospital",rest:"restaurante",lang:"es-419",gl:"BO",ceid:"BO:es-419"}
};
const NEAR = [["fuel","⛽ Postos"],["hotel","🛏 Hotel c/ garagem"],["mec","🔧 Mecânica"],["farm","💊 Farmácia"],["hosp","🏥 Hospital"],["rest","🍽 Comer"]];
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fmtDate = iso => { const [y,m,d] = iso.split("-"); return d+"/"+m; };
const WD = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
const wd = iso => WD[new Date(iso+"T12:00:00").getDay()];

/* ---------- armazenamento local (só neste aparelho) ---------- */
const store = {
  get(k){ try{ return localStorage.getItem("iu26:"+k); }catch(e){ return null; } },
  set(k,v){ try{ v==null ? localStorage.removeItem("iu26:"+k) : localStorage.setItem("iu26:"+k,v); }catch(e){} }
};
/* ---------- dados compartilhados (Supabase) + fila local ---------- */
const S = window.SYNC;
const PILOT = () => S.Pilot.isPilot() && !!S.Pilot.name();
let queue = [];
const thumbUrls = new Map();
const qThumb = it => { if (!thumbUrls.has(it.client_id)) thumbUrls.set(it.client_id, URL.createObjectURL(it.thumb || it.blob)); return thumbUrls.get(it.client_id); };
const checkinsAt = (d,i) => S.shared.checkins.filter(c => c.day===d && c.stop_idx===i)
  .concat(queue.filter(q => q.type==="checkin" && q.row.day===d && q.row.stop_idx===i).map(q => Object.assign({pending:true}, q.row)));
const mediaAt = (d,i) => S.shared.media.filter(m => m.day===d && (i==null || m.stop_idx===i)).map(m => Object.assign({url:S.publicUrl(m.path), thumb:S.publicUrl(m.path.replace(/\.(jpg|mp4|mov)$/,"_t.jpg"))}, m))
  .concat(queue.filter(q => q.type==="media" && q.row.day===d && (i==null || q.row.stop_idx===i)).map(q => Object.assign({pending:true, url:qThumb(q), thumb:qThumb(q)}, q.row)));
const isDone = (d,i) => checkinsAt(d,i).length > 0;
const dayDone = day => isDone(day.d, day.stops.length-1);
const hm = iso => { const t = new Date(iso); return t.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"}); };
const KIND = {passou:"passou", abasteceu:"abasteceu", chegou:"chegou", fronteira:"cruzou a fronteira"};

/* ---------- links ---------- */
const ll = s => `${s.lat},${s.lng}`;
const L = {
  waze: s => `https://waze.com/ul?ll=${ll(s)}&navigate=yes`,
  gmap: s => `https://www.google.com/maps/search/?api=1&query=${ll(s)}`,
  near: (s,k) => `https://www.google.com/maps/search/${encodeURIComponent(CC[s.cc||"BR"][k])}/@${ll(s)},13z`,
  q: q => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`,
  dayRoute(day){
    const st = day.stops; if (st.length < 2) return null;
    const mid = st.slice(1,-1).filter(s => s.t !== "border");
    let wp = mid;
    if (mid.length > 3) wp = [mid[Math.floor(mid.length*0.2)], mid[Math.floor(mid.length*0.5)], mid[Math.floor(mid.length*0.8)]];
    let u = `https://www.google.com/maps/dir/?api=1&origin=${ll(st[0])}&destination=${ll(st[st.length-1])}&travelmode=driving`;
    if (wp.length) u += "&waypoints=" + wp.map(ll).join("%7C");
    return u;
  },
  windy: s => `https://www.windy.com/${s.lat.toFixed(3)}/${s.lng.toFixed(3)}?${s.lat.toFixed(3)},${s.lng.toFixed(3)},9`,
  news(cc,q){ const c = CC[cc]; return `https://news.google.com/search?q=${encodeURIComponent(q)}&hl=${c.lang}&gl=${c.gl}&ceid=${c.ceid}`; }
};
function roadLinks(day){
  const ccs = [...new Set(day.stops.map(s => s.cc))];
  const end = day.stops[day.stops.length-1];
  const out = [];
  if (ccs.includes("PE")) out.push(["https://saecoe.mtc.gob.pe/visor","🇵🇪 Estado das vias (MTC Peru)"]);
  if (ccs.includes("BO")) out.push(["https://www.abc.gob.bo/","🇧🇴 ABC Bolívia (transitabilidade)"]);
  for (const cc of ccs){
    const q = cc==="BR" ? `${day.to} rodovia interditada OR acidente` : cc==="PE" ? `carretera ${day.to} bloqueo OR huaico OR derrumbe` : `bloqueo carretera ${day.to} OR ${day.from}`;
    out.push([L.news(cc,q), `📰 Notícias ${cc==="BR"?"da estrada":"(bloqueios) "+cc}`]);
  }
  out.push([L.windy(end), `🌦 Clima em ${day.to}`]);
  return out;
}

/* ---------- status / dia atual ---------- */
const todayIso = (() => { const n = new Date(); return new Date(n.getTime()-n.getTimezoneOffset()*60000).toISOString().slice(0,10); })();
const todayIdx = DAYS.findIndex(d => d.date === todayIso);
let sel = (() => {
  const h = parseInt((location.hash.match(/dia-(\d+)/)||[])[1],10);
  if (h >= 1 && h <= DAYS.length) return h-1;
  if (todayIdx >= 0) return todayIdx;
  return todayIso > DAYS[DAYS.length-1].date ? DAYS.length-1 : 0;
})();
function renderStatus(){
  const el = $("#status");
  const first = DAYS[0].date, last = DAYS[DAYS.length-1].date;
  if (todayIso < first){
    const n = Math.round((new Date(first+"T12:00:00") - new Date(todayIso+"T12:00:00"))/864e5);
    el.innerHTML = `Saída em <b>${n} dia${n>1?"s":""}</b><br>${fmtDate(first)} · ${DAYS[0].stops[0].n}`;
  } else if (todayIso > last){
    el.innerHTML = `<b>Expedição concluída</b><br>${fmtDate(first)} – ${fmtDate(last)}`;
  } else {
    const d = DAYS[todayIdx];
    el.innerHTML = `Hoje: <b>Dia ${String(d.d).padStart(2,"0")}</b><br>${esc(d.from)} → ${esc(d.to)}`;
  }
}
function renderStats(){
  const km = DAYS.reduce((a,d) => a + (R && R.km && R.km[d.d] ? R.km[d.d] : d.km), 0);
  const done = DAYS.filter(dayDone).length;
  $("#stats").innerHTML =
    `<div><b>${Math.round(km).toLocaleString("pt-BR")} km</b><span>${R?"traçado real":"estimativa"}</span></div>`+
    `<div><b>25 dias</b><span>${fmtDate(DAYS[0].date)} – ${fmtDate(DAYS[24].date)}</span></div>`+
    `<div><b>4 GS</b><span>3 × 1250 · 1 × 1300</span></div>`+
    `<div><b>${done}/25</b><span>dias concluídos</span></div>`;
}

/* ---------- mapa estilizado (SVG) ---------- */
const M = window.SAMAP;
const merc = lat => Math.log(Math.tan(Math.PI/4 + lat*Math.PI/360));
const kx = M.P.W/(M.P.lonMax-M.P.lonMin), ky = M.P.W/((M.P.lonMax-M.P.lonMin)*Math.PI/180), yTop = merc(M.P.latMax);
const proj = (lat,lng) => [ (lng-M.P.lonMin)*kx, (yTop-merc(lat))*ky ];
const lineOf = day => (R && R.lines[day.d]) ? R.lines[day.d] : day.stops.map(s => [s.lat,s.lng]);
function renderSA(){
  // recorte automático na região da rota
  let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
  DAYS.forEach(d => lineOf(d).forEach(p => { const [x,y] = proj(p[0],p[1]); x0=Math.min(x0,x); x1=Math.max(x1,x); y0=Math.min(y0,y); y1=Math.max(y1,y); }));
  const pad = 45; const VB = {x:x0-pad-40, y:y0-pad, w:(x1-x0)+2*pad+40, h:(y1-y0)+2*pad};
  let s = `<svg viewBox="${VB.x} ${VB.y} ${VB.w} ${VB.h}" xmlns="http://www.w3.org/2000/svg" role="img">`;
  for (const c of M.countries) s += `<path class="country${["BR","PE","BO"].includes(c.c)?" on":""}" d="${c.d}"/>`;
  const lab = [["BRASIL",-12.5,-49],["PERU",-9.6,-75.6],["BOLÍVIA",-15.6,-64.8],["CHILE",-24,-69.6],["PARAGUAI",-22.5,-58.6]];
  for (const [t,la,lo] of lab){ const [x,y] = proj(la,lo); s += `<text class="clabel" x="${x}" y="${y}" text-anchor="middle">${t}</text>`; }
  const order = DAYS.map((d,i) => i).filter(i => i !== sel).concat([sel]);
  order.forEach(i => { const d = DAYS[i];
    if (d.km === 0) return;
    const pts = lineOf(d).map(p => proj(p[0],p[1]).map(v => v.toFixed(1)).join(",")).join(" ");
    const col = PROF[d.profile].c === "#1c2530" ? "#e9e1d2" : PROF[d.profile].c;
    s += `<polyline class="seg${dayDone(d)?" done":""}${i===sel?" sel":""}" data-i="${i}" stroke="${i===sel?"#f0c35a":col}" points="${pts}"/>`;
    s += `<polyline class="seg-hit" data-i="${i}" points="${pts}"/>`;
  });
  const big = ["Governador Valadares","Rio Branco","Cusco","Arequipa","La Paz","Uyuni","Santa Cruz de la Sierra","Corumbá"];
  const seen = new Set();
  DAYS.forEach(d => { const e = d.stops[d.stops.length-1]; if (seen.has(e.n)) return; seen.add(e.n);
    const [x,y] = proj(e.lat,e.lng); const b = big.includes(e.n);
    s += `<circle class="city${b?" big":""}" cx="${x}" cy="${y}" r="${b?5.5:3.5}"/>`;
    if (b){ const nm = e.n.replace(" de la Sierra","").replace("Governador ","Gov. ");
      const left = ["La Paz","Uyuni","Arequipa","Cusco","Governador Valadares"].includes(e.n);
      s += `<text class="cname" x="${x+(left?-9:9)}" y="${y+4}" text-anchor="${left?"end":"start"}">${nm}</text>`; }
  });
  s += `</svg>`;
  const box = $("#samap"); box.innerHTML = s;
  box.querySelectorAll("[data-i]").forEach(el => el.addEventListener("click", () => select(+el.dataset.i, true)));
}

/* ---------- faixa de dias ---------- */
function renderChips(){
  const nav = $("#days");
  nav.innerHTML = DAYS.map((d,i) => `<button class="chip${i===sel?" sel":""}${i===todayIdx?" today":""}${dayDone(d)?" ok":""}" data-i="${i}" aria-label="Dia ${d.d}, ${fmtDate(d.date)}, ${esc(d.from)} para ${esc(d.to)}"><b>${String(d.d).padStart(2,"0")}</b><small>${fmtDate(d.date)}</small><i style="background:${PROF[d.profile].c}"></i></button>`).join("");
  nav.querySelectorAll(".chip").forEach(b => b.addEventListener("click", () => select(+b.dataset.i, false)));
  const c = nav.querySelector(".chip.sel"); if (c) c.scrollIntoView({inline:"center", block:"nearest", behavior:"smooth"});
}

/* ---------- card do dia ---------- */
function stopHTML(day, s, i){
  const next = day.stops[i+1];
  const gap = next ? next.km - s.km : 0;
  const nextFuel = (() => { for (let j=i+1;j<day.stops.length;j++){ const x = day.stops[j]; if (x.t==="fuel"||x.t==="end") return x; } return null; })();
  const fuelGap = (s.t==="fuel"||s.t==="start") && nextFuel ? nextFuel.km - s.km : 0;
  const tagC = s.c ? `<span class="tag ${s.c.toLowerCase()}">${{C:"Certo",P:"Provável",S:"Suposição"}[s.c]}</span>` : "";
  const kind = {start:"Saída",fuel:"Abastecer",border:"Fronteira",stop:"Referência",end:"Pernoite"}[s.t];
  const done = isDone(day.d,i);
  const ckKind = s.t==="end" ? "chegou" : s.t==="fuel" ? "abasteceu" : s.t==="border" ? "fronteira" : "passou";
  const tickLabel = s.t==="end" ? "Chegamos aqui" : s.t==="fuel" ? "Abastecemos aqui" : s.t==="border" ? "Fronteira cruzada" : "Passamos aqui";
  const cks = checkinsAt(day.d,i), mds = mediaAt(day.d,i);
  const ckList = cks.length ? `<ul class="cks">${cks.map(c => `<li>${c.pending?"⏳":"✓"} <b>${esc(c.pilot)}</b> ${KIND[c.kind]||c.kind} · ${hm(c.happened_at)}${c.note?` — ${esc(c.note)}`:""}${PILOT() && c.pilot===S.Pilot.name() ? ` <button class="lnk" data-undo="${esc(c.client_id)}">desfazer</button>`:""}</li>`).join("")}</ul>` : "";
  const thumbs = mds.length ? `<div class="thumbs">${mds.slice(0,8).map(m => `<button class="th${m.kind==="video"?" vid":""}" data-view="${esc(m.client_id)}" style="background-image:url('${m.thumb}')">${m.pending?"<i>⏳</i>":""}</button>`).join("")}${mds.length>8?`<span class="more">+${mds.length-8}</span>`:""}</div>` : "";
  return `<li class="stop ${s.t}${done?" done":""}" data-i="${i}">
    <span class="dot"></span>
    <div class="sbox">
      <div class="srow" data-open><span class="sname">${esc(s.n)}</span><span class="skm">km ${s.km} · ${kind}</span>${tagC}<span class="toggle">opções ▾</span></div>
      ${s.note ? `<p class="snote">${esc(s.note)}</p>`:""}
      ${(cks.length||mds.length) ? `<p class="snote ok">${cks.length?`✓ ${cks.length} check-in${cks.length>1?"s":""}`:""}${cks.length&&mds.length?" · ":""}${mds.length?`📷 ${mds.length}`:""}</p>`:""}
      ${fuelGap ? `<p class="gap${fuelGap>T.autonomy.rule?" over":""}">⛽ Próximo abastecimento em ~${fuelGap} km${fuelGap>T.autonomy.rule?" — acima da regra de 200 km":""}</p>` : ""}
      <div class="sx">
        ${PILOT() ? `<div class="pact"><button class="btn sm${done?" ghost":""}" data-ck="${i}" data-kind="${ckKind}">✓ ${tickLabel}</button><label class="btn sm ghost">📷 Mídia<input type="file" accept="image/*,video/*" multiple hidden data-media="${i}"></label></div>` : ""}
        ${ckList}${thumbs}
        <div class="links">
          <a href="${L.waze(s)}" target="_blank" rel="noopener">🚗 Waze</a>
          <a href="${L.gmap(s)}" target="_blank" rel="noopener">📍 Google Maps</a>
        </div>
        <div class="links">${NEAR.map(([k,t]) => `<a href="${L.near(s,k)}" target="_blank" rel="noopener">${t}</a>`).join("")}</div>
      </div>
    </div></li>`;
}
const openStops = new Set();
function renderDay(){
  const d = DAYS[sel], P = PROF[d.profile];
  const kmReal = R && R.km && R.km[d.d];
  const el = $("#day");
  el.style.borderLeftColor = P.c;
  const maxKm = 850;
  let h = `<div class="day-h"><div class="dnum" style="color:${P.c}">DIA ${String(d.d).padStart(2,"0")}<span>${fmtDate(d.date)} · ${wd(d.date)}</span></div><span class="badge" style="background:${P.c}">${P.l}</span></div>`;
  h += `<h2>${esc(d.from)}${d.km?` <span class="arr">→</span> ${esc(d.to)}`:""}</h2>`;
  if (d.km){
    h += `<div class="meta">${kmReal?`${Math.round(kmReal)} km (traçado real)`:`~${d.km} km`}${d.kmRoadbook?` <span class="muted small">· roadbook: ${d.kmRoadbook}</span>`:""} · Saída ${d.depart} · Chegada-alvo ${d.arrive}</div>`;
    h += `<div class="bar"><i style="width:${Math.min(100,(kmReal||d.km)/maxKm*100)}%;background:${P.c}"></i></div>`;
  } else h += `<div class="meta">Sem deslocamento</div><div class="bar"><i style="width:3%;background:${P.c}"></i></div>`;
  h += `<p class="lead">${esc(d.note)}</p>`;
  if (d.alert) h += `<div class="alert warn"><b>ATENÇÃO</b>${esc(d.alert)}</div>`;
  if (d.emergency) h += `<div class="alert emerg"><b>PLANO B</b>${esc(d.emergency)}</div>`;
  if (d.alt) h += `<div class="alert alt"><b>ROTA ALTERNATIVA</b><strong>${esc(d.alt.t)}:</strong> ${esc(d.alt.d)}</div>`;
  if (d.km){
    const end = d.stops[d.stops.length-1];
    h += `<div class="actions"><a class="btn" href="${L.dayRoute(d)}" target="_blank" rel="noopener">🗺 Rota do dia no Google Maps</a><a class="btn ghost" href="${L.waze(end)}" target="_blank" rel="noopener">🚗 Waze até ${esc(d.to)}</a></div>`;
    h += `<div class="sec-t">Estrada e clima — conferir na noite anterior</div><div class="links">${roadLinks(d).map(([u,t]) => `<a href="${u}" target="_blank" rel="noopener">${t}</a>`).join("")}</div>`;
    h += `<div class="sec-t">Paradas · toque para ver opções</div>`;
  } else {
    h += `<div class="sec-t">Na cidade</div>`;
  }
  h += `<ol class="stops">${d.stops.map((s,i) => stopHTML(d,s,i)).join("")}</ol>`;
  h += `<div class="sec-t">Avisar a família</div><div class="actions"><button class="btn wa" id="wa">✅ Chegamos — avisar no WhatsApp</button></div>`;
  el.innerHTML = h;
  el.querySelectorAll("[data-open]").forEach(r => r.addEventListener("click", e => { const li = e.currentTarget.closest(".stop"); li.classList.toggle("open"); const k = d.d+":"+li.dataset.i; li.classList.contains("open") ? openStops.add(k) : openStops.delete(k); }));
  el.querySelectorAll("[data-ck]").forEach(b => b.addEventListener("click", async e => {
    e.stopPropagation(); const i = +b.dataset.ck; b.disabled = true;
    await S.addCheckin({day:d.d, stop_idx:i, stop_name:d.stops[i].n, kind:b.dataset.kind});
    toast(navigator.onLine ? "Check-in enviado" : "Sem sinal — check-in guardado, sobe quando tiver internet");
  }));
  el.querySelectorAll("[data-undo]").forEach(b => b.addEventListener("click", async e => {
    e.stopPropagation(); if (!confirm("Desfazer este check-in?")) return;
    try{ await S.removeCheckin(b.dataset.undo); }catch(err){ toast("Precisa de internet para desfazer"); }
  }));
  el.querySelectorAll("[data-media]").forEach(inp => inp.addEventListener("change", e => handleFiles(d, +inp.dataset.media, inp.files, inp)));
  el.querySelectorAll("[data-view]").forEach(b => b.addEventListener("click", e => { e.stopPropagation(); openViewer(b.dataset.view); }));
  el.querySelectorAll(".stop").forEach(li => { if (openStops.has(d.d+":"+li.dataset.i)) li.classList.add("open"); });
  $("#wa").addEventListener("click", () => {
    const end = d.stops[d.stops.length-1];
    const km = kmReal ? Math.round(kmReal) : d.km;
    const msg = d.km
      ? `🏍️ Expedição Incas & Uyuni — Dia ${String(d.d).padStart(2,"0")} (${fmtDate(d.date)})\nChegamos em ${d.to}! ${km} km rodados hoje.\nTodos bem, 4 motos ok.\nAmanhã: ${DAYS[sel+1] ? DAYS[sel+1].from+" → "+DAYS[sel+1].to : "fim da viagem"}.\nRoteiro: ${location.href.split("#")[0]}#dia-${d.d}`
      : `🏍️ Expedição Incas & Uyuni — Dia ${String(d.d).padStart(2,"0")} (${fmtDate(d.date)})\nDia livre em ${d.to}. Todos bem!\nRoteiro: ${location.href.split("#")[0]}#dia-${d.d}`;
    if (PILOT() && !isDone(d.d, d.stops.length-1)) S.addCheckin({day:d.d, stop_idx:d.stops.length-1, stop_name:end.n, kind:"chegou"});
    window.open("https://wa.me/?text=" + encodeURIComponent(msg), "_blank");
  });
}

/* ---------- mapa detalhado (Leaflet) ---------- */
let lmap = null, lDay = null;
function popupHTML(s){
  return `<b>${esc(s.n)}</b><br><span class="muted">km ${s.km}</span>${s.note?`<br>${esc(s.note)}`:""}
    <div class="links"><a href="${L.waze(s)}" target="_blank" rel="noopener">Waze</a><a href="${L.gmap(s)}" target="_blank" rel="noopener">Maps</a>${NEAR.slice(0,4).map(([k,t]) => `<a href="${L.near(s,k)}" target="_blank" rel="noopener">${t}</a>`).join("")}</div>`;
}
function initLeaflet(){
  if (lmap || !window.L) return;
  $("#lmap").hidden = false; $("#loadmap").textContent = "Centralizar no dia";
  lmap = window.L.map("lmap", {scrollWheelZoom:false});
  window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {maxZoom:18, attribution:'© OpenStreetMap'}).addTo(lmap);
  DAYS.forEach(d => { if (d.km) window.L.polyline(lineOf(d), {color:"#6d6a62", weight:2, opacity:.5}).addTo(lmap); });
  updateLeaflet();
}
function updateLeaflet(){
  if (!lmap) return;
  if (lDay) lmap.removeLayer(lDay);
  const d = DAYS[sel]; lDay = window.L.layerGroup().addTo(lmap);
  if (d.km) window.L.polyline(lineOf(d), {color:PROF[d.profile].c==="#1c2530"?"#1f5c5e":PROF[d.profile].c, weight:5}).addTo(lDay);
  d.stops.forEach(s => {
    const col = s.t==="fuel" ? "#b8892b" : s.t==="border" ? "#ad3a2c" : "#1c2530";
    window.L.circleMarker([s.lat,s.lng], {radius: s.t==="end"||s.t==="start"?8:6, color:"#fff", weight:2, fillColor:col, fillOpacity:1}).bindPopup(popupHTML(s)).addTo(lDay);
  });
  if (d.d===9 || d.d===8) T.bmw.filter(b => b.city==="Cusco").forEach(addBmw);
  if (d.d===15) T.bmw.filter(b => b.city==="Arequipa").forEach(addBmw);
  const b = window.L.latLngBounds(d.stops.map(s => [s.lat,s.lng]));
  d.km ? lmap.fitBounds(b, {padding:[30,30]}) : lmap.setView([d.stops[0].lat,d.stops[0].lng], 12);
}
function addBmw(b){ window.L.marker([b.lat,b.lng]).bindPopup(`<b>${esc(b.name)}</b><br>${esc(b.addr)}<div class="links"><a href="${L.q(b.name+" "+b.addr+" "+b.city)}" target="_blank" rel="noopener">Abrir no Maps</a></div>`).addTo(lDay); }


/* ---------- mídia, visualizador, diário, piloto ---------- */
function toast(t){
  let el = document.getElementById("toast"); if (!el){ el = document.createElement("div"); el.id = "toast"; document.body.appendChild(el); }
  el.textContent = t; el.classList.add("on"); clearTimeout(toast._t); toast._t = setTimeout(() => el.classList.remove("on"), 3200);
}
function videoThumb(file){
  return new Promise(res => {
    const url = URL.createObjectURL(file), v = document.createElement("video");
    let done = false; const fin = b => { if (done) return; done = true; URL.revokeObjectURL(url); res(b); };
    v.muted = true; v.playsInline = true; v.preload = "auto"; v.src = url;
    v.onloadeddata = () => { try{ v.currentTime = Math.min(0.5, (v.duration||1)/2); }catch(e){ fin(null); } };
    v.onseeked = () => { try{ const k = Math.min(1, 480/Math.max(v.videoWidth, v.videoHeight)); const c = document.createElement("canvas"); c.width = Math.round(v.videoWidth*k)||480; c.height = Math.round(v.videoHeight*k)||270; c.getContext("2d").drawImage(v,0,0,c.width,c.height); c.toBlob(b => fin(b), "image/jpeg", .7); }catch(e){ fin(null); } };
    v.onerror = () => fin(null); setTimeout(() => fin(null), 6000);
  }).then(b => b || new Promise(res => { const c = document.createElement("canvas"); c.width = 480; c.height = 270; const g = c.getContext("2d"); g.fillStyle = "#1c2530"; g.fillRect(0,0,480,270); g.fillStyle = "#fff"; g.font = "bold 90px sans-serif"; g.textAlign = "center"; g.fillText("▶", 240, 165); c.toBlob(res, "image/jpeg", .7); }));
}
async function handleFiles(d, i, files, inp){
  const list = Array.from(files || []); if (!list.length) return;
  let ok = 0, skipped = 0, vids = 0;
  toast(`Preparando ${list.length} arquivo${list.length>1?"s":""}…`);
  for (const f of list){
    try{
      if (f.type.startsWith("video/")){
        if (f.size > window.CFG.maxVideoMB*1024*1024){ skipped++; continue; }
        await S.addMedia({day:d.d, stop_idx:i, stop_name:d.stops[i].n, kind:"video", blob:f, thumb: await videoThumb(f), type: f.type || "video/quicktime"});
        vids++; ok++;
      } else {
        const p = await window.MEDIA.processPhoto(f);
        await S.addMedia({day:d.d, stop_idx:i, stop_name:d.stops[i].n, kind:"photo", blob:p.blob, thumb:p.thumb, type:"image/jpeg", width:p.width, height:p.height});
        ok++;
      }
    }catch(e){ skipped++; }
  }
  inp.value = "";
  toast(`${ok} guardado${ok!==1?"s":""}${vids?` (${vids} vídeo${vids>1?"s":""} aguardando Wi-Fi)`:""}${skipped?` · ${skipped} ignorado${skipped>1?"s":""} (vídeo acima de ${window.CFG.maxVideoMB} MB ou arquivo inválido)`:""}`);
}
function findMedia(id){
  const m = S.shared.media.find(x => x.client_id === id);
  if (m) return Object.assign({url:S.publicUrl(m.path)}, m);
  const q = queue.find(x => x.client_id === id);
  if (q){ if (!thumbUrls.has(id+":full")) thumbUrls.set(id+":full", URL.createObjectURL(q.blob)); return Object.assign({pending:true, url:thumbUrls.get(id+":full")}, q.row); }
  return null;
}
function frameInfo(m){
  const day = DAYS.find(x => x.d === m.day) || DAYS[0];
  const cc = (day.stops[m.stop_idx] || {}).cc;
  const country = {BR:"Brasil", PE:"Peru", BO:"Bolívia"}[cc] || "";
  return { title: `${m.stop_name}${country?" · "+country:""}`, sub: `Dia ${String(m.day).padStart(2,"0")} · ${day.date ? day.date.split("-").reverse().join("/") : new Date(m.taken_at).toLocaleDateString("pt-BR")} · Expedição Incas & Uyuni 2026` };
}
function openViewer(id){
  const m = findMedia(id); if (!m) return;
  let v = document.getElementById("viewer");
  if (!v){ v = document.createElement("div"); v.id = "viewer"; v.addEventListener("click", e => { if (e.target === v || e.target.dataset.close != null) v.classList.remove("on"); }); document.body.appendChild(v); }
  const info = frameInfo(m);
  v.innerHTML = `<div class="vbox">
    ${m.kind==="video" ? `<video src="${m.url}" controls playsinline></video>` : `<img src="${m.url}" alt="">`}
    <div class="vmeta"><b>${esc(m.stop_name)}</b> · Dia ${m.day} · ${esc(m.pilot)} · ${new Date(m.taken_at).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})}${m.pending?" · ⏳ aguardando envio":""}</div>
    <div class="actions">${m.kind==="photo" ? `<button class="btn" id="vshare">Compartilhar com moldura</button>` : `<a class="btn" href="${m.url}" target="_blank" rel="noopener" download>Abrir vídeo</a>`}<button class="btn ghost" data-close>Fechar</button></div></div>`;
  v.classList.add("on");
  const b = document.getElementById("vshare");
  if (b) b.addEventListener("click", async () => {
    b.disabled = true; b.textContent = "Preparando…";
    try{ await window.MEDIA.share(m.url, info, `incas-uyuni-dia${String(m.day).padStart(2,"0")}-${m.client_id.slice(0,6)}.jpg`); }
    catch(e){ toast("Não consegui gerar a imagem — tente de novo com internet"); }
    b.disabled = false; b.textContent = "Compartilhar com moldura";
  });
}
function renderDiary(){
  const el = document.getElementById("diario-list"); if (!el) return;
  const byDay = new Map();
  const all = S.shared.checkins.concat(queue.filter(q => q.type==="checkin").map(q => Object.assign({pending:true}, q.row)));
  for (const c of all){ if (!byDay.has(c.day)) byDay.set(c.day, {ck:[], md:[]}); byDay.get(c.day).ck.push(c); }
  for (const m of S.shared.media){ if (!byDay.has(m.day)) byDay.set(m.day, {ck:[], md:[]}); byDay.get(m.day).md.push(m); }
  const days = [...byDay.keys()].sort((a,b) => b-a);
  if (!days.length){ el.innerHTML = `<p class="muted small">Ainda não há registros. Os check-ins e fotos dos pilotos aparecem aqui para todos — inclusive para a família.</p>`; return; }
  el.innerHTML = days.map(n => {
    const d = DAYS.find(x => x.d === n) || {from:"",to:"",date:""}, g = byDay.get(n);
    const ck = g.ck.sort((a,b) => a.happened_at < b.happened_at ? -1 : 1);
    const ph = mediaAt(n, null);
    return `<div class="dentry"><div class="dh"><b>Dia ${String(n).padStart(2,"0")}</b> · ${d.date?fmtDate(d.date):""} · ${esc(d.from)}${d.to&&d.to!==d.from?" → "+esc(d.to):""}<button class="lnk" data-goto="${n}">ver dia</button></div>
      <ul class="cks">${ck.map(c => `<li>${c.pending?"⏳":"✓"} ${hm(c.happened_at)} · <b>${esc(c.pilot)}</b> ${KIND[c.kind]||c.kind} em ${esc(c.stop_name)}${c.note?` — ${esc(c.note)}`:""}</li>`).join("")}</ul>
      ${ph.length?`<div class="thumbs">${ph.map(m => `<button class="th${m.kind==="video"?" vid":""}" data-view="${esc(m.client_id)}" style="background-image:url('${m.thumb}')">${m.pending?"<i>⏳</i>":""}</button>`).join("")}</div>`:""}</div>`;
  }).join("");
  el.querySelectorAll("[data-view]").forEach(b => b.addEventListener("click", () => openViewer(b.dataset.view)));
  el.querySelectorAll("[data-goto]").forEach(b => b.addEventListener("click", () => select(DAYS.findIndex(x => x.d === +b.dataset.goto), true)));
}
function renderSyncBar(){
  const el = document.getElementById("syncbar"); if (!el) return;
  const st = S.status;
  if (!PILOT()){
    el.innerHTML = `<span>👀 Acompanhando a expedição${st.lastSync?` · atualizado ${hm(st.lastSync)}`:""}</span><button class="lnk" id="iampilot">Sou piloto</button>`;
  } else {
    const pend = st.pending, vids = st.videosWaiting;
    el.innerHTML = `<span>🏍 <b>${esc(S.Pilot.name())}</b> · ${!navigator.onLine?"sem sinal · ":""}${pend ? `⏳ ${pend} aguardando envio` : "✓ tudo enviado"}${st.lastError && pend ? ` · <span class="err">${esc(st.lastError)}</span>`:""}</span>
      ${vids?`<button class="btn sm" id="sendvids">Enviar ${vids} vídeo${vids>1?"s":""} (use Wi-Fi)</button>`:""}<button class="lnk" id="iampilot">trocar</button>`;
    const sv = document.getElementById("sendvids"); if (sv) sv.addEventListener("click", () => { toast("Enviando vídeos… mantenha o app aberto"); S.flush({videos:true}); });
  }
  document.getElementById("iampilot").addEventListener("click", pilotDialog);
}
function pilotDialog(){
  let v = document.getElementById("pdlg");
  if (!v){ v = document.createElement("div"); v.id = "pdlg"; document.body.appendChild(v); }
  v.innerHTML = `<form class="vbox pbox"><h3>Modo piloto</h3>
    <p class="small muted">Para fazer check-in e enviar fotos. A família não precisa disso — só abre o link.</p>
    <label>Código de piloto<input name="code" autocomplete="off" autocapitalize="none" value="${esc(S.Pilot.code()||"")}" required></label>
    <label>Seu nome (aparece nos check-ins)<input name="name" maxlength="40" value="${esc(S.Pilot.name()||"")}" required></label>
    <p class="small err" id="perr"></p>
    <div class="actions"><button class="btn" type="submit">Entrar</button><button class="btn ghost" type="button" data-close>Cancelar</button>${S.Pilot.isPilot()?`<button class="btn ghost" type="button" id="plogout">Sair do modo piloto</button>`:""}</div></form>`;
  v.classList.add("on");
  v.querySelector("[data-close]").addEventListener("click", () => v.classList.remove("on"));
  const lo = document.getElementById("plogout"); if (lo) lo.addEventListener("click", () => { S.Pilot.setCode(null); v.classList.remove("on"); refresh(); });
  v.querySelector("form").addEventListener("submit", async e => {
    e.preventDefault(); const f = e.target, code = f.code.value.trim(), name = f.name.value.trim();
    if (navigator.onLine){ const ok = await S.checkCode(code).catch(() => null); if (ok === false){ document.getElementById("perr").textContent = "Código incorreto."; return; } }
    S.Pilot.setCode(code); S.Pilot.setName(name); v.classList.remove("on"); toast("Modo piloto ativado"); refresh(); S.flush();
  });
}
let rt = null;
async function refresh(){
  queue = await S.pending();
  renderSyncBar(); renderChips(); renderStats(); renderSA(); renderDay(); renderDiary();
}
S.onChange(() => { clearTimeout(rt); rt = setTimeout(refresh, 150); });

/* ---------- seleção ---------- */
function select(i, scroll){
  sel = i;
  try{ history.replaceState(null, "", "#dia-"+DAYS[i].d); }catch(e){}
  renderChips(); renderDay(); renderSA(); updateLeaflet();
  if (scroll) $("#days").scrollIntoView({behavior:"smooth", block:"start"});
}

/* ---------- inicialização ---------- */
function initStatic(){
  $("#bmw").innerHTML = T.bmw.map(b => `<div class="item"><div><b>${esc(b.city)}</b> · ${esc(b.name)}<br><span class="small muted">${esc(b.addr)}</span></div><a class="btn sm ghost" href="${L.q(b.name+" "+b.addr+" "+b.city)}" target="_blank" rel="noopener">Abrir no Maps</a></div>`).join("");
  document.querySelectorAll(".check input[data-k]").forEach(cb => {
    cb.checked = store.get("c:"+cb.dataset.k) === "1";
    cb.addEventListener("change", () => store.set("c:"+cb.dataset.k, cb.checked ? "1" : null));
  });
  $("#loadmap").addEventListener("click", () => { lmap ? updateLeaflet() : initLeaflet(); });
  if (!window.L) { $("#loadmap").disabled = true; $("#map-hint").textContent = "Mapa detalhado indisponível (sem internet). Use o OsmAnd com o arquivo GPX."; }
  $("#ver").textContent = "08/10/2026";
}
renderStatus(); renderStats(); renderSA(); renderChips(); renderDay(); initStatic(); refresh();
if (S.Pilot.isPilot() && !S.Pilot.name()) setTimeout(pilotDialog, 400);
})();
