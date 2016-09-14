function initApplication() {
	if (navigator.serviceWorker) {
		navigator.serviceWorker.register('sw.js').then(function(reg) {
			console.log('YOU DID IT!!!' + reg.scope);
		}).catch(function(error) {
			console.log('Nope you made a boo boo and uh baa-baa and a ' + error);
		});
	}
	
	var map;
	var geocoder;
	userCity = '';
	userCityGeocode = {};
	allMarkers = [];

	function initAutoComplete() {
		var autocomplete = new google.maps.places.Autocomplete(
			(document.getElementById('intro-search-input')));
	}

	initAutoComplete();

	initViewModel();
} //initApplication Closing Brace