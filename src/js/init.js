function initApplication() {
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