self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('v1').then( (cache) => {
            return cache.addAll([
                './',
                './index.html',
                './style.css',
                './script.js',
                './img1',
                './fav_icon'
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    // console.log(event.request.url);

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
            return caches.match('./img1/default.jpg');
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