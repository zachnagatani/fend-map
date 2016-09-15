var staticCache = 'feastOn-static-cache-v1';
var apiCache = 'feastOn-api-cache-v1';

this.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open(staticCache)
			.then(function(cache) {
				return cache.addAll([
					'https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.7/css/materialize.min.css',
					'http://fonts.googleapis.com/icon?family=Material+Icons',
					'https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.7/js/materialize.min.js'
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

	if (requestUrl.href.startsWith('http://localhost:9999/')) {
		event.respondWith(grabStatic(event.request));
	}

	if (requestUrl.href.startsWith('https://api.foursquare.com/') || 
		requestUrl.href.startsWith('http://fonts.googleapis.com/') || 
		requestUrl.href.startsWith('https://cdnjs.cloudflare.com/')) {
		event.respondWith(grabStatic(event.request));
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

function grabStatic(request) {
	return caches.open(staticCache).then(function(cache) {
		return cache.match(request.url).then(function(response) {
			if (response) return response;
			
			return fetch(request).then(function(networkResponse) {
				cache.put(request.url, networkResponse.clone());
				return networkResponse;
			});
		});
	});
}