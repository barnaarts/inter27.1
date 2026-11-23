// Offline support: the page is fetched fresh when online (so updates arrive), photos come from the cache
const V="inter-20261123190000";
const FILES=["./", "index.html", "manifest.webmanifest", "leaflet.js", "leaflet.css", "icon-180.png", "icon-192.png", "icon-512.png", "img/a-albert-quesada-katie-vickers.jpg", "img/a-ale.jpg", "img/av-albert.jpg", "img/av-katie.jpg", "img/a-catalina-girona.jpg", "img/a-darryl-eisden.jpg", "img/a-joaquin-jara.jpg", "img/a-los-informalls.jpg", "img/a-maria-sellares.jpg", "img/a-nuria-andorra.jpg", "img/a-frames-percussion.jpg", "img/a-neil-lorenzo.jpg", "img/a-betsy-towns.jpg", "img/a-abigail-gomez.jpg", "img/a-nuria-guiu.jpg", "img/a-taller-estampa.jpg", "img/eyes-albert.jpg", "img/eyes-katie.jpg", "img/logo.png", "img/logo.svg", "img/metro-map.jpg", "img/sala-reflexio.jpg", "img/v-batllo.jpg", "img/v-brujas.jpg", "img/v-caldera.jpg", "img/v-filmo.jpg", "img/v-joaquin.jpg", "img/v-lliure.jpg", "img/v-macba.jpg", "img/v-mercat.jpg", "img/v-pedrera.jpg", "img/v-piconera.jpg", "img/v-nuriaandorra.jpg", "img/v-neil.jpg", "img/v-auditori.jpg", "img/v-santam.jpg", "img/v-servei.jpg", "img/v-tapies.jpg", "img/v-visiva.jpg", "img/v-yugo.jpg", "img/v-unmaking.jpg", "img/v-taller46.jpg"];
self.addEventListener("install",e=>{ e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())); });
self.addEventListener("activate",e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V&&k!=="inter-tiles").map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener("fetch",e=>{
  const u=new URL(e.request.url);
  // Map tiles: keep the ones already seen so the map works offline
  if(e.request.method==="GET" && u.hostname==="tile.openstreetmap.org"){
    e.respondWith(caches.open("inter-tiles").then(c=>c.match(e.request).then(r=>r||fetch(e.request).then(n=>{ if(n.ok||n.type==="opaque") c.put(e.request,n.clone()); return n; }))));
    return;
  }
  if(e.request.method!=="GET"||u.origin!==location.origin) return;
  if(e.request.mode==="navigate"||u.pathname.endsWith(".html")||u.pathname.endsWith("/")){
    e.respondWith(fetch(e.request,{cache:"no-cache"}).then(r=>{ const c=r.clone(); caches.open(V).then(x=>x.put(e.request,c)); return r; }).catch(()=>caches.match(e.request).then(r=>r||caches.match("index.html"))));
    return;
  }
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(n=>{ const c=n.clone(); caches.open(V).then(x=>x.put(e.request,c)); return n; })));
});
