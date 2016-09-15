var staticCache = 'feastOn-static-cache-v1';
var venueCache = 'feastOn-venue-cache-v1';
var venueInfoCache = 'feastOn-venue-info-cache-v1';

function fetchAndCache(myCache, request) {
	return caches.open(myCache).then(function(cache) {
		return cache.match(request.url).then(function(response) {
			if (response) return response;
			
			return fetch(request).then(function(networkResponse) {
				cache.put(request.url, networkResponse.clone());
				return networkResponse;
			});
		});
	});
}

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

this.addEventListener('fetch', function(event) {
	var requestUrl = new URL(event.request.url);

	if (requestUrl.href.startsWith('http://localhost:9999/')  || 
		requestUrl.href.startsWith('http://fonts.googleapis.com/') || 
		requestUrl.href.startsWith('https://cdnjs.cloudflare.com/')) {
		event.respondWith(fetchAndCache(staticCache, event.request));
	}

	if (requestUrl.href.startsWith('https://api.foursquare.com/') && requestUrl.href.startsWith('https://api.foursquare.com/v2/venues/explore')) {
		event.respondWith(fetchAndCache(venueCache, event.request));
	}

	if (requestUrl.href.startsWith('https://api.foursquare.com/') && !requestUrl.href.startsWith('https://api.foursquare.com/v2/venues/explore')) {
		event.respondWith(fetchAndCache(venueInfoCache, event.request));
	}
});