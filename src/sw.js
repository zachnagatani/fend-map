var staticCache = 'feastOn-static-cache-v1';
var apiCache = 'feastOn-api-cache-v1';

this.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open(staticCache)
			.then(function(cache) {
				return cache.addAll([
					'http://localhost:9999/src/index.html',
					'http://localhost:9999/src/css/style.css'
				]);
			})
	);
});

// this.addEventListener('fetch', function(event) {
// 	event.respondWith(apiCache(event.request));
// });

// function staticCacheCheck(request) {
// 	return caches.open(staticCacheCheck)
// }

// function apiCache(request) {
// 	return caches.open(apiCache).then(function(cache) {
// 		return cache.match(request.url).then(function(reponse) {
// 			if (response) return response;

// 			return fetch(request).then(function(networkResponse) {
// 				cache.put(request.url, networkResponse.clone());
// 				return networkResponse;
// 			})
// 		})
// 	})
// }

this.addEventListener('fetch', function(event) {
	var requestUrl = new URL(event.request.url);
	if (requestUrl.href.startsWith('https://api.foursquare.com/')) {
		event.respondWith(grabScript(event.request));
	}
});

function grabScript(request) {
	return caches.open(apiCache).then(function(cache) {
		return cache.match(request.url).then(function(response) {
			if (response) return response;
			
			return fetch(request).then(function(networkResponse) {
				cache.put(request.url, networkResponse.clone());
				return networkResponse;
			});
		});
	});
}