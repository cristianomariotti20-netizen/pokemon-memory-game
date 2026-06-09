const CACHE_NAME = 'pokememory-v1';
const ASSETS = [
  './',
  './index.html',
  './estilo.css',
  './js.js',
  './manifest.json',
  './Arena.png.jpeg',
  './Imagens/pokebola fundo.png.jpeg',
  './Imagens/treecko.png.jpeg',
  './Imagens/sceptile.png.jpeg',
  './Imagens/piplup.png.jpeg',
  './Imagens/Logotipo.png.jpeg',
  './Imagens/greninja.png.jpeg',
  './Imagens/charizard.png.jpeg'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS).catch(err => console.log("Erro no cache: ", err));
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});
