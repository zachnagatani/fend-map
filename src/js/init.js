function initApplication() {
	var map;
	var geocoder;
	userCity = '';
	userCityGeocode = {};
	allMarkers = [];
	function styleInfoWindow() {
		google.maps.event.addListener(infoWindow, 'domready', function() {
			var iwOuter = $('.gm-style-iw');

			/* The DIV we want to change is above the .gm-style-iw DIV.
			 * So, we use jQuery and create a iwBackground variable,
			 * and took advantage of the existing reference to .gm-style-iw for the previous DIV with .prev().
			 */
			var iwBackground = iwOuter.prev();

			iwBackground.children(':nth-child(2)').css({
				'display': 'none'
			});

			iwBackground.children(':nth-child(4)').css({
				'display': 'none'
			});

			iwBackground.children(':nth-child(1)').css({
				'position': 'relative',
				'z-index': '0'
			});

			iwBackground.children(':nth-child(3)').find('div').children().css({
				'box-shadow': 'none',
				'z-index': '-1',
				'background': 'rgba(255, 255, 255, 1)',
				'position': 'relative',
				'z-index': '0'
			});

			iwBackground.children(':nth-child(3)').find('div').children().css({
				'z-index': '1'
			});

			var iwCloseBtn = iwOuter.next();

			var iwCloseBtnX = iwCloseBtn.next();

			iwCloseBtn.css({
				width: "25px",
				height: "25px",
				opacity: '1', // by default the close button has an opacity of 0.7
				right: '25px',
				top: '6px', // button repositioning
				border: '1px solid #019CDE', // increasing button border and new color
				'border-radius': '13px', // circular effect
				'box-shadow': '0 0 5px #f0f0f0', // 3D effect to highlight the button
				background: '#fff'
			});

			iwCloseBtn.children(':nth-child(1)').css({
				top: '-330px',
				left: '3px'
			});

			iwCloseBtn.mouseout(function() {
				$(this).css({
					opacity: '1'
				});
			});
		});
	}

	// Function to find the location of the user
	function findLocation() {
		// If there geolocation is not supported, return
		if (!navigator.geolocation) return;

		// The element to update with the location (the input field in this case)
		var output = $('#intro-search-input');

		// The success callback function if the location is retrieved
		function success(position) {
			// Access the latitude and longitude that are returned
			var latitude = position.coords.latitude;
			var longitude = position.coords.longitude;

			// Use the Google Maps Geocoding API's reverse geocoding to grab an address from the lat and long
			// Your own API key is required from google
			fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&key=AIzaSyDstwW4Ea6RJFKBuw2hj2kHXAcFioor_2o').then(function(response) {
				// Convert the response to a JSON object and return it
				// This will be an array of objects containing address information
				return response.json();
			}).then(function(results) {
				// Update the value of our input field with the formatted_address property
				// from the first object in array
				output.val(results.results[0].formatted_address);
			});
		}

		// If the location cannot be retrieved, alert the user
		// On mobile, this could be because their location services are turned off
		function error() {
			alert('Sorry; we couldn\'t find your location. Please make sure your location services (GPS) are enabled.');
		}

		// Call the HTML5 geolocation API and pass in our success and error callback functions
		// Also pass in our object with options: enableHighAccuracy may cause geolocating to take longer,
		// but should return a more accurate result. Timeout is the maximum length of time allowed
		// before the error handler is called (default is infinity). MaximumAge is the oldest a cached
		// location is allowed to be before the actual current location must be fetched. Setting to 0
		// forces the geolocater to fetch the actual current location
		navigator.geolocation.getCurrentPosition(success, error, {enableHighAccuracy: true, timeout: 30000, maximumAge: 0});
	}

	// Call findLocation
	findLocation();


	initViewModel();
} //initApplication Closing Brace