/* LiveLingo 2 cross-origin isolation for navigation only. */
"use strict";
self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});
self.addEventListener("fetch", (event) => {
  const req=event.request;
  if (req.mode !== "navigate") return;
  event.respondWith(
    fetch(req).then((res) => {
      if (!res.ok) return res;
      const headers=new Headers(res.headers);
      headers.set("Cross-Origin-Opener-Policy","same-origin");
      headers.set("Cross-Origin-Embedder-Policy","require-corp");
      return new Response(res.body,{
        status:res.status,
        statusText:res.statusText,
        headers
      });
    })
  );
});
