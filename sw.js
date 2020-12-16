const cacheName = 'v1';
const cacheAssets = [
        '/',
        '/page/index.html',
        '/style/style.css',
        '/script/script.js',
        '/images/',
        '/images/default.jpg',
        '/images/app_logo.png',
        '/apple-touch-icon.png',
        '/android-chrome-192x192.png',
        '/maskable_icon.png',
        '/favicon.ico',
        '/safari-pinned-tab.svg',
        '/sound/sound.mp3'
    ];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches
        .open(cacheName)
        .then( (cache) => {
            return cache.addAll(cacheAssets);
        })
    );
});

self.addEventListener('activate', (e) => {  
    // clearing old cache
    e.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
            cacheNames.map((cache) => {
                if (cache !== cacheName) {
                    console.log('Service Worker is clearing old cache');
                    return caches.delete(cache);
                };
            })
        );
      })
    );
});

self.addEventListener('fetch', (event) => {
    // console.log(event.request.url);

    // event.respondWith(fetch(event.request).catch( () => caches.match(event.request))
    event.respondWith(
        caches.match(event.request).then( (resp) => {
            return resp || fetch(event.request).then( (response) => {
                let responseClone = response.clone();
                caches.open('v1').then( (cache) => {
                    cache.put(event.request, responseClone);
                    return response;
                });

                return response;
            });
        }).catch( () => {
            return caches.match('/images/default.jpg');
        })
    );
});


    // To update
// self.addEventListener('install', (event) => {
//     event.waitUntil(
//       caches.open('v2').then((cache) => {
//         return cache.addAll([
//           './sw-test/',
//           './sw-test/index.html',
//           './sw-test/style.css',
//           './sw-test/app.js',
//           './sw-test/image-list.js',
          

//           ...
//           // include other new resources for the new version...

//         ]);
//       })
//     );
//   });

    //Deleting old caches
// self.addEventListener('activate', (event) => {
//     var cacheKeeplist = ['v2'];
  
//     event.waitUntil(
//       caches.keys().then((keyList) => {
//         return Promise.all(keyList.map((key) => {
//           if (cacheKeeplist.indexOf(key) === -1) {
//             return caches.delete(key);
//           }
//         }));
//       })
//     );
//   });