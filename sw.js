/* Service worker: o app abre sem internet. Arquivos do site: serve do cache e atualiza em segundo plano.
   Fotos públicas do Supabase: guardadas depois da primeira visualização. API: sempre rede. */
const V = "iu26-v3";
const SHELL = ["./","index.html","imprimir.html","app.js","style.css","data.js","samap.js","config.js","sync.js","media.js",
  "manifest.webmanifest","vendor/leaflet.js","vendor/leaflet.css","img/nodedata-logo.png","img/icon-192.png","img/icon-180.png","img/icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith("iu26-") && k !== V && k !== "iu26-media").map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const r = e.request; if (r.method !== "GET") return;
  const u = new URL(r.url);
  if (u.hostname.endsWith("supabase.co")){
    if (u.pathname.includes("/storage/v1/object/public/")){
      e.respondWith(caches.open("iu26-media").then(async c => { const hit = await c.match(r); if (hit) return hit;
        const res = await fetch(r); if (res.ok) c.put(r, res.clone()); return res; }));
    }
    return; // REST: rede direta
  }
  if (u.origin === location.origin || u.hostname.includes("fonts.g")){
    e.respondWith(caches.open(V).then(async c => {
      const key = r.mode === "navigate" ? "index.html" : r;
      const hit = await c.match(r, {ignoreSearch: r.mode === "navigate"}) || (r.mode === "navigate" ? await c.match("index.html") : null);
      const net = fetch(r).then(res => { if (res.ok && (res.type === "basic" || res.type === "cors")) c.put(r, res.clone()); return res; }).catch(() => hit);
      return hit || net;
    }));
  }
});
