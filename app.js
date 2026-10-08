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
const mem = {};
const isDone = (d,i) => (store.get(`s:${d}:${i}`) ?? mem[`s:${d}:${i}`]) === "1";
const setDone = (d,i,v) => { mem[`s:${d}:${i}`] = v ? "1" : null; store.set(`s:${d}:${i}`, v ? "1" : null); };
const dayDone = day => isDone(day.d, day.stops.length-1);

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
  const tickLabel = s.t==="end" ? "Chegamos aqui" : s.t==="fuel" ? "Abastecemos aqui" : s.t==="border" ? "Fronteira cruzada" : "Passamos aqui";
  return `<li class="stop ${s.t}${done?" done":""}" data-i="${i}">
    <span class="dot"></span>
    <div class="sbox">
      <div class="srow" data-open><span class="sname">${esc(s.n)}</span><span class="skm">km ${s.km} · ${kind}</span>${tagC}<span class="toggle">opções ▾</span></div>
      ${s.note ? `<p class="snote">${esc(s.note)}</p>`:""}
      ${fuelGap ? `<p class="gap${fuelGap>T.autonomy.rule?" over":""}">⛽ Próximo abastecimento em ~${fuelGap} km${fuelGap>T.autonomy.rule?" — acima da regra de 200 km":""}</p>` : ""}
      <div class="sx">
        <label class="tick"><input type="checkbox" data-tick="${i}" ${done?"checked":""}> ${tickLabel}</label>
        <div class="links">
          <a href="${L.waze(s)}" target="_blank" rel="noopener">🚗 Waze</a>
          <a href="${L.gmap(s)}" target="_blank" rel="noopener">📍 Google Maps</a>
        </div>
        <div class="links">${NEAR.map(([k,t]) => `<a href="${L.near(s,k)}" target="_blank" rel="noopener">${t}</a>`).join("")}</div>
      </div>
    </div></li>`;
}
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
  el.querySelectorAll("[data-open]").forEach(r => r.addEventListener("click", e => { e.currentTarget.closest(".stop").classList.toggle("open"); }));
  el.querySelectorAll("[data-tick]").forEach(cb => cb.addEventListener("change", e => {
    setDone(d.d, +e.target.dataset.tick, e.target.checked);
    e.target.closest(".stop").classList.toggle("done", e.target.checked);
    renderChips(); renderStats(); renderSA();
  }));
  $("#wa").addEventListener("click", () => {
    const end = d.stops[d.stops.length-1];
    const km = kmReal ? Math.round(kmReal) : d.km;
    const msg = d.km
      ? `🏍️ Expedição Incas & Uyuni — Dia ${String(d.d).padStart(2,"0")} (${fmtDate(d.date)})\nChegamos em ${d.to}! ${km} km rodados hoje.\nTodos bem, 4 motos ok.\nAmanhã: ${DAYS[sel+1] ? DAYS[sel+1].from+" → "+DAYS[sel+1].to : "fim da viagem"}.\nRoteiro: ${location.href.split("#")[0]}#dia-${d.d}`
      : `🏍️ Expedição Incas & Uyuni — Dia ${String(d.d).padStart(2,"0")} (${fmtDate(d.date)})\nDia livre em ${d.to}. Todos bem!\nRoteiro: ${location.href.split("#")[0]}#dia-${d.d}`;
    if (!isDone(d.d, d.stops.length-1)){ setDone(d.d, d.stops.length-1, true); renderChips(); renderStats(); renderSA(); renderDay(); }
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
renderStatus(); renderStats(); renderSA(); renderChips(); renderDay(); initStatic();
})();
