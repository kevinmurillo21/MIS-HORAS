const C='mishoras-v3',F=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>clients.claim()))});
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 e.respondWith((async()=>{
  const c=await caches.open(C);
  try{
   const r=await Promise.race([fetch(e.request,{cache:'no-cache'}),new Promise((_,j)=>setTimeout(j,4000))]);
   if(r&&r.ok)c.put(e.request,r.clone());
   return r;
  }catch(x){
   return (await c.match(e.request))||(await c.match('index.html'));
  }
 })());
});
self.addEventListener('push',e=>{e.waitUntil(self.registration.showNotification('⏰ Se acabó tu almuerzo',{body:'Es hora de volver. Toca para marcar tu entrada.',tag:'almuerzo-fin',icon:'icon-192.png',vibrate:[200,100,200],requireInteraction:true}))});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(l=>l.length?l[0].focus():clients.openWindow('./')))});
