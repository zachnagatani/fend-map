// Create a loading screen for the app
function preLoad() {

	// On load, make the loading image fade-out slowly
	$(window).load(function() {
		$(".se-pre-con").fadeOut("slow");
	});

}

// Run the preLoader
preLoad();


// Error handling for google maps
function googleMapsTimeout() {


	var googleMapsTimeout = setTimeout(function() {
		var loaderWrapper = document.getElementById('loaderWrapper');
		if (typeof google === 'object' && typeof google.maps === 'object') {
			loaderWrapper.style.opacity = "0";
			loaderWrapper.style.zIndex = "0";
		} else {
			alert('This is taking longer than usual... reload the page. Homie.');
		}
	}, 5000);
}


// Wrap app in a function for Google Maps API to callback
function initApplication() {
	// "Global" variables for access by all parts of app
	var map;
	var geocoder;
	var userCity = "";
	var userCityGeocode = {};
	var allMarkers = [];
	var infoWindow = new google.maps.InfoWindow({
		content: infoWindowNode
	});

	// Styling for the infoWindow: http://en.marnoto.com/2014/09/5-formas-de-personalizar-infowindow.html
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

			iwBackground.children(':nth-child(3)').find('div').children().css({
				'box-shadow': 'none',
				'z-index': '1',
				'background': 'rgba(255, 255, 255, 1)'
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
				right: '-75px',
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

	styleInfoWindow();

	// KO ViewModel
	var ViewModel = {

		// Empty obersvableArray to store the venus provided by foursquare
		foursquareVenues: ko.observableArray([]),

		foursquareVenuesList: ko.observableArray([foursquareVenues]),

		// Observable to store all the google maps markers
		markerList: ko.observableArray([allMarkers]),

		// Empty oberservable string for our filter
		query: ko.observable(''),


		// Hook our query to our search function
		subscribeToSearch: function() {
			ViewModel.query.subscribe(ViewModel.search);
		},

		// Filter function
		search: function(value) {

			// Remove the markers from the map upon calling of filter
			allMarkers.forEach(function(marker) {

				marker.setMap(null);

			});

			// Filter markers
			for (var x in allMarkers) {

				// If titles match the query, put them back on the map
				if (allMarkers[x].title.toLowerCase().indexOf(value.toLowerCase()) >= 0) {

					allMarkers[x].setMap(map);

				}

			}

			// Grab the list of locations
			var listItemsList = document.getElementsByClassName('listItem');

			// Remove the list items from the DOM when search function is called
			for (var i = 0; i < listItemsList.length; i++) {

				listItemsList[i].style.display = "none";

			}

			// Filter the list items
			for (var i in listItemsList) {

				// If the name of the food type or the text content of the locations match, add them to the DOM again
				if (foursquareVenues[i].categories[0].name.toLowerCase().indexOf(value.toLowerCase()) >= 0 || listItemsList[i].textContent.toLowerCase().indexOf(value.toLowerCase()) >= 0) {

					listItemsList[i].style.display = "flex";

				}

			}

		},

		// Empty observable for the location name
		venueName: ko.observable(),

		// Store different DOM elements for easy access
		listContainer: document.getElementById('listContainer'),

		openNavButton: document.getElementById('openNav'),

		closeNavButton: document.getElementById('closeNav'),

		searchSection: document.getElementById('searchSection'),

		// Open nav function for mobile
		openNav: function() {
			// Opacity is used for transition affect
			// Z-index is used to allow other elements to be selected
			ViewModel.listContainer.style.zIndex = "2";
			ViewModel.listContainer.style.opacity = "1";

			ViewModel.openNavButton.style.display = "none";
			ViewModel.closeNavButton.style.display = "block";

			ViewModel.searchSection.style.zIndex = "3";
			ViewModel.searchSection.style.opacity = "1";
		},

		// Close nav function for mobile
		closeNav: function() {

			ViewModel.listContainer.style.zIndex = "0";
			ViewModel.listContainer.style.opacity = "0";

			ViewModel.searchSection.style.zIndex = "0";
			ViewModel.searchSection.style.opacity = "0";

			ViewModel.closeNavButton.style.display = "none";
			ViewModel.openNavButton.style.display = "block";

		},

		// Close the nav when a list item is selected on mobile
		closeNavOnSelect: function() {

			// Check for mobile width
			if ($(window).width() < 768) {
				// Close the nav
				ViewModel.closeNav();
			}
		},

		// Observables for different location data items to update the DOM
		venuePrice: ko.observable(),
		foursquareLocation: ko.observable(),
		googleDirections: ko.observable(),
		foursquareWebsite: ko.observable(),
		foursquareContact: ko.observable(),
		foursquareStatus: ko.observable(),
		foursquareRating: ko.observable(),

		// DOM elements needed to access infoWindow div

		infoWindowNode: document.getElementById('infoWindowNode'),

		infoWindowHeader: document.getElementById('infoWindowHeader'),

		// Open the infoWindow from the list items
		openInfoWindow: function(index) {

			// Display the infoWindowNode
			ViewModel.infoWindowNode.style.display = "block";

			// Update the venueName in the DOM with the right name
			ViewModel.venueName(ViewModel.foursquareVenues()[index].name);
			console.log(ViewModel.venueName());
			// Open the infoWindow over the correct marker
			infoWindow.open(map, allMarkers[index]);

			// Call the foursquare API
			function getFourSquare() {

				// Grab the venuID (needed to call the API) from the model
				var venueID = ViewModel.foursquareVenues()[index].id;

				// Call the API
				var foursquareURL = "https://api.foursquare.com/v2/venues/" + venueID + "?client_id=2DV1P3YPGYBLCEXLTRGNBKZR2EHZINKEHVET2TCUFQFQ23KS&client_secret=EFDTVXXZJSBEVC12RAMZBV24RFUDEY3E1CG2USRDT0NWEK1A&v=20170101&m=foursquare";
				$.ajax({
					dataType: "jsonp",
					url: foursquareURL
				}).done(function(data) {
					// Log the data for testing
					console.log(data);
					// Error handling in case there is the venue can't be found
					if (!("venue" in data.response)) {
						$('#infoWindowContentContainer').empty();
						$('#infoWindowContentContainer').append("<h3 id='foursquareError'>Sorry! Foursquare data could not be found for this location.");

					} else {

						// Store the venue for easy access
						var venueInfo = data.response.venue;

						// Update the price in the DOM
						ViewModel.venuePrice(venueInfo.attributes.groups[0].summary);

						// Update the address in the DOM
						ViewModel.foursquareLocation(venueInfo.location.address + " " + venueInfo.location.city + ", " + venueInfo.location.state);

						// URL to send the user to google maps for directions
						var googleDirectionsURL = "http://maps.google.com/maps?saddr=" + userCity + "&daddr=" + venueInfo.location.address + venueInfo.location.city + venueInfo.location.state;

						// Set the href attribute to the proper URL so the user gets the correct directions
						document.getElementById('googleDirections').setAttribute("href", googleDirectionsURL);

						// Set the href attribute to the correct URL for the location website
						document.getElementById('foursquareLink').setAttribute("href", venueInfo.url);

						// Update the DOM with the correct phone number
						ViewModel.foursquareContact(venueInfo.contact.formattedPhone);

						// Update the DOM with the correct status (closed, open, etc)
						ViewModel.foursquareStatus(venueInfo.hours.status);

						// If there is a rating, display it with the proper background
						if (venueInfo.rating !== undefined) {
							ViewModel.foursquareRating(venueInfo.rating);
						}

						$('#foursquareRating').css({
							background: '#' + venueInfo.ratingColor
						});

					}
					// Error handling in case the API call fails
				}).fail(function() {
					$('#infoWindowContentContainer').empty();
					$("#infoWindowContentContainer").append("<h3>Foursquare could not be reached at this time.</h3>");

				});

			}

			getFourSquare();

			// Add an animation bounce to the correct markers when clicked from a list item
			if (allMarkers[index].getAnimation() !== null) {

				allMarkers[index].setAnimation(null);

			} else {

				allMarkers[index].setAnimation(google.maps.Animation.BOUNCE);
				setTimeout(function() {
					allMarkers[index].setAnimation(null);
				}, 750);

			}

		},

		userAddress: ko.observable(),

		// Initialize the google map
		initMap: function() {

			// Create a new geocoder instance
			geocoder = new google.maps.Geocoder();

			// Create a new map
			var mapCenter = {
				lat: 37.3036,
				lng: -121.8974
			};

			var zoomVal;

			if($(window).width() <= 768) {
				zoomVal = 11;
			} else {
				zoomVal = 14;
			}

			console.log(zoomVal);
			map = new google.maps.Map(document.getElementById('mapContainer'), {
				center: mapCenter,
				zoom: zoomVal,

				mapTypeControl: false
			});

			// Grab geocode from user inputted address
			if (geocoder) {
				geocoder.geocode({
					'address': userCity
				}, function(results, status) {
					if (status == google.maps.GeocoderStatus.OK) {
						if (status !== google.maps.GeocoderStatus.ZERO_RESULTS) {
							// Set the map's center to the geocode
							map.setCenter(results[0].geometry.location);
							userCityGeocode = results[0].geometry.location;
						}
					}
				});
			}

			// create the markers for the map
			ViewModel.createMarkers();

			// On resize, keep the map centered in the correct location
			google.maps.event.addDomListener(window, 'resize', function() {
				map.setCenter(userCityGeocode);
			});

		},

		// Create the map markers
		createMarkers: function() {

			// For each location...
			foursquareVenues.forEach(function(location) {

				// Set the coordinatesd for the marker
				location.coordinates = {
					"lat": location.location.lat,
					"lng": location.location.lng
				};

				// Create a new marker
				var marker = new google.maps.Marker({
					position: location.coordinates,
					map: map,
					title: location.name,
					animation: google.maps.Animation.DROP,

				});

				// Push the marker into our allMarkers array
				allMarkers.push(marker);
				// Allow an infoWindow to be created from the marker
				function createInfoWindow() {

					ViewModel.infoWindowNode.style.display = "block";

					infoWindow.open(map, marker);

				}

				// Call the foursquare API from the marker
				function getFourSquare() {

					// Update the DOM with the correct location name
					ViewModel.venueName(marker.title);


					var venueID = location.id;

					// Call the API
					var foursquareURL = "https://api.foursquare.com/v2/venues/" + venueID + "?client_id=2DV1P3YPGYBLCEXLTRGNBKZR2EHZINKEHVET2TCUFQFQ23KS&client_secret=EFDTVXXZJSBEVC12RAMZBV24RFUDEY3E1CG2USRDT0NWEK1A&v=20170101&m=foursquare";
					$.ajax({
						dataType: "jsonp",
						url: foursquareURL
					}).done(function(data) {
						console.log(data);
						// Error handling if the venue can't be found
						if (!("venue" in data.response)) {
							$('#infoWindowContentContainer').empty();
							$('#infoWindowContentContainer').append("<h3 id='foursquareError'>Sorry! Foursquare data could not be found for this location.");

						} else {

							// Store the venue from the response for easy access
							var venueInfo = data.response.venue;

							// Update the DOM with the correct price
							ViewModel.venuePrice(venueInfo.attributes.groups[0].summary);

							// Update the DOM with the correct address
							ViewModel.foursquareLocation(venueInfo.location.address + " " + venueInfo.location.city + ", " + venueInfo.location.state);

							// URL to send the user for google maps directions
							var googleDirectionsURL = "http://maps.google.com/maps?saddr=" + userCity + "&daddr=" + venueInfo.location.address + venueInfo.location.city + venueInfo.location.state;

							// Set the href to the correct URL for directions
							document.getElementById('googleDirections').setAttribute("href", googleDirectionsURL);

							// Set the href to the correct URL for location's website
							document.getElementById('foursquareLink').setAttribute("href", venueInfo.url);

							// Update the DOM with correct phone number
							ViewModel.foursquareContact(venueInfo.contact.formattedPhone);

							// Update the DOM with correct hours/status
							ViewModel.foursquareStatus(venueInfo.hours.status);

							// Update DOM with correct rating/color if it exists
							if (venueInfo.rating !== undefined) {
								ViewModel.foursquareRating(venueInfo.rating);
							}

							$('#foursquareRating').css({
								background: '#' + venueInfo.ratingColor
							});

						}
					}).fail(function() {
						// Error handling if API call fails
						$("#infoWindowContentContainer").empty();
						$("#infoWindowNode").append("<h3>Foursquare could not be reached at this time.</h3>");

					});

				}

				// Add animation to the markers upon click
				function toggleBounce() {
					if (marker.getAnimation() !== null) {

						marker.setAnimation(null);

					} else {

						marker.setAnimation(google.maps.Animation.BOUNCE);
						setTimeout(function() {
							marker.setAnimation(null);
						}, 750);

					}
				}

				// Call the needed functions when a marker is clicked
				marker.addListener('click', function() {

					createInfoWindow();

					getFourSquare();

					toggleBounce();

				});

			});

		},

		// Search functionality up on app load
		introSearch: function() {

			// Grab the input element
			var introSearchInput = document.getElementById('introSearchInput');

			// Store the user's input into our "global" variable to be used in other functions
			userCity = introSearchInput.value;

			// Grab the locations from foursquare and populate our model
			function getFoursquareVenues() {

				// the correct API URL
				var foursquareVenuesURL = "https://api.foursquare.com/v2/venues/explore?near=" + introSearchInput.value + "&section=food&limit=50&client_id=2DV1P3YPGYBLCEXLTRGNBKZR2EHZINKEHVET2TCUFQFQ23KS&client_secret=EFDTVXXZJSBEVC12RAMZBV24RFUDEY3E1CG2USRDT0NWEK1A&v=20170101&m=foursquare";

				// Call the API
				$.ajax({

					dataType: "jsonp",
					url: foursquareVenuesURL

				}).done(function(data) {

					console.log(data);

					if (!data.response.groups) {
						// Error handling if a proper address isn't entered and foursquare can't send us data
						alert('Error! Please enter a properly formatted address or city.');
					} else {

						// Array of locations
						var foursquareVenueResponseArray = data.response.groups[0].items;

						// For each location...
						foursquareVenueResponseArray.forEach(function(venue) {

							// Push the location into our model
							foursquareVenues.push(venue.venue);

						});

						// Initialize our google map upon the populating our model
						ViewModel.initMap();

						// Close the search when the map is initalized
						var closeSearch = function() {

							// Opacity for transition, display none to remove it from the DOM after one second
							var introSearchContainer = document.getElementById('introSearchContainer');
							introSearchContainer.style.opacity = "0";
							var displayTimeout = setTimeout(function() {

								introSearchContainer.style.display = "none";

							}, 1000);

						};

						closeSearch();

						// Immediately...
						(function() {

							// Push each venue into our obersvable array of venues
							foursquareVenues.forEach(function(venue) {
								ViewModel.foursquareVenues.push(venue);
							});

							// console.log for testing
							console.log(ViewModel.foursquareVenues());

						})();

						// Update our obersvable of the user's address
						ViewModel.userAddress(userCity);

					}

				}).fail(function() {

					// Error handling if the API can't be reached
					alert("Sorry; the Foursquare servers could not be reached.");

				});

			}

			getFoursquareVenues();

		},

	}; //ViewModel Closing Brace

	ko.applyBindings(ViewModel);

	ViewModel.subscribeToSearch();

} //initApplication Closing Brace