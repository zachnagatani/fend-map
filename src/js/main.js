function initViewModel() {
	var ViewModel = {
		foursquareVenues: ko.observableArray([]),
		foursquareVenuesList: ko.observableArray([foursquareVenues]),
		markerList: ko.observableArray([allMarkers]),
		query: ko.observable(''),
		foursquareVenuesFilter: ko.observable(),

		userAddress: ko.observable(),

		foursquareVenueNames: [],
		venuePrice: ko.observable(),
		foursquareLocation: ko.observable(),
		googleDirections: ko.observable(),
		foursquareWebsite: ko.observable(),
		foursquareURL: ko.observable(),
		foursquareContact: ko.observable(),
		foursquareStatus: ko.observable(),
		foursquareRating: ko.observable(),
		foursquareNoVenue: ko.observable(),
		foursquareError: ko.observable(false),
		infoWindowNode: document.getElementById('infoWindowNode'),
		index: ko.observable(),

		venueName: ko.observable(),

		listContainer: document.getElementById('list-container'),
		openNavButton: document.getElementById('open-nav'),
		closeNavButton: document.getElementById('close-nav'),
		searchSection: document.getElementById('search-section'),
		filterBtn: document.getElementById('filter-btn'),
		closeFilterBtn: document.getElementById('close-filter-btn'),

		introSearchInput: ko.observable(''),
		fetch: function(url) {
			return fetch(url);
		},
		getJSON: function(url) {
			return ViewModel.fetch(url).then(function(response) {
				return response.json();
			});
		},

					// Function to find the location of the user
		findLocation: function() {
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
					var indexEnd = results.results[0].formatted_address.search(", USA");
					ViewModel.introSearchInput(results.results[0].formatted_address.substring(0, indexEnd));
					output.val(Viewmodel.introSearchInput());
					// output.val(results.results[0].address_components[0].long_name + ' ' + results.results[0].address_components[1].short_name + ' ' + results.results[0].address_components[3].long_name + ', ' + results.results[0].address_components[5].short_name);

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
		},

		introSearch: function() {

			userCity = ViewModel.introSearchInput();

			var introURL = "https://api.foursquare.com/v2/venues/explore?near=" + ViewModel.introSearchInput() +
			"&section=food&limit=50&client_id=2DV1P3YPGYBLCEXLTRGNBKZR2EHZINKEHVET2TCUFQFQ23KS&client_secret=EFD" +
			"TVXXZJSBEVC12RAMZBV24RFUDEY3E1CG2USRDT0NWEK1A&v=20170101&m=foursquare";


			ViewModel.getJSON(introURL)
			.then(function(response) {
				var foursquareVenueResponseArray = response.response.groups[0].items;
				foursquareVenueResponseArray.forEach(function(venue) {
					foursquareVenues.push(venue.venue);
				});

				ViewModel.initMap();

				(function() {
					foursquareVenues.forEach(function(venue) {
						ViewModel.foursquareVenues.push(venue);
					});
				})();

				ViewModel.userAddress(userCity);
				ViewModel.venueNames();
			})
			.then(function() {
				(function(){
					var introSearchContainer = document.getElementById(
						'intro-search-container');
					introSearchContainer.style.opacity = "0";
					var displayTimeout = setTimeout(function() {
						introSearchContainer.style.display = "none";
					}, 1000);
				})();
			})
			.catch(function(){
				alert("Sorry; the Foursquare servers could not be reached.");
			});
		},

		initMap: function() {
			geocoder = new google.maps.Geocoder();

			var mapCenter = {
				lat: 37.3036,
				lng: -121.8974
			};

			var zoomVal;
			if ($(window).width() <= 768) {
				zoomVal = 11;
			} else {
				zoomVal = 14;
			}

			map = new google.maps.Map(document.getElementById('map-container'), {
				center: mapCenter,
				zoom: zoomVal,
				mapTypeControl: false
			});
			if (geocoder) {
				geocoder.geocode({
					'address': userCity
				}, function(results, status) {
					if (status == google.maps.GeocoderStatus.OK) {
						if (status !== google.maps.GeocoderStatus.ZERO_RESULTS) {
							map.setCenter(results[0].geometry.location);
							userCityGeocode = results[0].geometry.location;
						}
					}
				});
			}

			ViewModel.createMarkers();

			google.maps.event.addDomListener(window, 'resize', function() {
				map.setCenter(userCityGeocode);
			});
		},
		createMarkers: function() {
			foursquareVenues.forEach(function(location) {
				location.coordinates = {
					"lat": location.location.lat,
					"lng": location.location.lng
				};
				var marker = new google.maps.Marker({
					position: location.coordinates,
					map: map,
					title: location.name,
					animation: google.maps.Animation.DROP,
				});
				allMarkers.push(marker);
				function createInfoWindow() {
					ViewModel.venueName(marker.title);
					$('#modal1').openModal();
				}

				function panToVenue() {
					var latLng = new google.maps.LatLng(location.coordinates.lat, location.coordinates.lng);
					map.panTo(latLng);
				}

				function grabMarkerIndex() {
					ViewModel.index(foursquareVenues.indexOf(location));
				}
				function toggleBounce() {
					marker.setAnimation(google.maps.Animation.BOUNCE);
					setTimeout(function() {
						marker.setAnimation(null);
					}, 1400);
				}
				marker.addListener('click', function() {
					grabMarkerIndex();
					ViewModel.closeFilterOnSelect();
					panToVenue();
					toggleBounce();
					createInfoWindow();
					ViewModel.getFourSquare();
				});
			});
		},
		openInfoWindow: function(index) {
			ViewModel.index(index);

			ViewModel.closeFilterOnSelect();
			ViewModel.venueName(ViewModel.foursquareVenues()[index].name);
			var indexByName = ViewModel.foursquareVenueNames.indexOf(ViewModel.venueName());
			ViewModel.getFourSquare();
			panToVenue();
			allMarkers[indexByName].setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function() {
				allMarkers[indexByName].setAnimation(null);
			}, 1400);
			ViewModel.closeNavOnSelect();
			$('#modal1').openModal();

			function panToVenue() {
				var latLng = new google.maps.LatLng(ViewModel.foursquareVenues()[index].location.lat, ViewModel.foursquareVenues()[index].location.lng);
				map.panTo(latLng);
			}
		},
		getFourSquare: function() {
			var venueID = ViewModel.foursquareVenues()[ViewModel.index()].id;
			var foursquareURL = "https://api.foursquare.com/v2/venues/" + venueID +
				"?client_id=2DV1P3YPGYBLCEXLTRGNBKZR2EHZINKEHVET2TCUFQFQ23KS&client_secret=EFDTVXXZJSBEVC12RAMZBV24RFUDEY3E1CG2USRDT0NWEK1A&v=20170101&m=foursquare";


			ViewModel.getJSON(foursquareURL)
			.then(function(response) {
				var venueInfo = response.response.venue;

				venueInfo.attributes.groups[0].summary ? ViewModel.venuePrice(venueInfo
					.attributes.groups[0].summary) : ViewModel.venuePrice(
					'Price info is not available for this location.');

				venueInfo.location.address !== undefined && venueInfo.location.city !==
					undefined && venueInfo.location.state !== undefined ? ViewModel.foursquareLocation(
						venueInfo.location.address + " " + venueInfo.location.city + ", " +
						venueInfo.location.state) : ViewModel.foursquareLocation(
						'Address is not available');

				var googleDirectionsURL;

				ViewModel.foursquareLocation() === 'Address is not available' ?
					googleDirectionsURL = null : googleDirectionsURL =
					"http://maps.google.com/maps?saddr=" + userCity + "&daddr=" +
					venueInfo.location.address + venueInfo.location.city + venueInfo.location
					.state;

				googleDirectionsURL !== null ? ViewModel.googleDirections(
					googleDirectionsURL) : ViewModel.googleDirections(null);

				venueInfo.url ? ViewModel.foursquareURL(venueInfo.url) : ViewModel.foursquareURL(
					null);

				venueInfo.contact.formattedPhone ? ViewModel.foursquareContact(
					venueInfo.contact.formattedPhone) : ViewModel.foursquareContact(
					'Phone number not avaialable');

				venueInfo.hours ? ViewModel.foursquareStatus(venueInfo.hours.status) :
					ViewModel.foursquareStatus('Open/Closed Status Not Available');

				venueInfo.rating !== undefined ? ViewModel.foursquareRating(venueInfo.rating) :
					ViewModel.foursquareRating('No Rating Avaialable');

				venueInfo.ratingColor ? $('#foursquare-rating').css({
					background: '#' + venueInfo.ratingColor
				}) : $('#foursquare-rating').css({
					background: '#fff'
				});
			})
			.catch(function() {
				ViewModel.foursquareError(true);
				ViewModel.venuePrice('');
				ViewModel.foursquareLocation('');
				ViewModel.googleDirections('');
				ViewModel.foursquareURL('#');
				ViewModel.foursquareContact('');
				ViewModel.foursquareStatus('');
				ViewModel.foursquareRating('');
				$('#foursquare-rating').css({
					background: '#fff',
				});

				alert("Foursquare could not be reached at this time.");
			});
		},

		venueNames: function() {
			foursquareVenues.forEach(function(venue) {
				ViewModel.foursquareVenueNames.push(venue.name);
			});
		},

		stopRefreshOnEnter: $(function() {
			$("form").submit(function() {
				return false;
			});
		}),

		subscribeToSearch: function() {
			ViewModel.query.subscribe(ViewModel.search);
		},

		search: function(value) {
			allMarkers.forEach(function(marker) {
				marker.setVisible(false);
			});
			allMarkers.forEach(function(marker) {
				if (marker.title.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
					marker.setVisible(true);
				}
			});
			ViewModel.foursquareVenues.removeAll();
			foursquareVenues.forEach(function(venue) {
				if (venue.categories[0].name.toLowerCase().indexOf(value.toLowerCase()) >=
					0 || venue.name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
					ViewModel.foursquareVenues.push(venue);
				}
			});
		},

		openNav: function() {
			ViewModel.listContainer.style.zIndex = "2";
			ViewModel.listContainer.style.opacity = "1";

			ViewModel.openNavButton.style.display = "none";
			ViewModel.closeNavButton.style.display = "block";

			ViewModel.searchSection.style.zIndex = "3";
			ViewModel.searchSection.style.opacity = "1";
		},

		closeNav: function() {
			ViewModel.listContainer.style.zIndex = "0";
			ViewModel.listContainer.style.opacity = "0";

			ViewModel.searchSection.style.zIndex = "0";
			ViewModel.searchSection.style.opacity = "0";

			ViewModel.closeNavButton.style.display = "none";
			ViewModel.openNavButton.style.display = "block";
		},

		closeNavOnSelect: function() {
			if ($(window).width() <= 1000) {
				ViewModel.closeNav();
			}
		},

		openFilter: function() {
			ViewModel.searchSection.style.top = '50px';

			ViewModel.filterBtn.style.display = "none";
			ViewModel.closeFilterBtn.style.display = "inline-block";
		},

		openFilterOnSelect: function() {
			if ($(window).width() > 1000) {
				ViewModel.openFilter();
			}
		},

		closeFilter: function() {
			ViewModel.searchSection.style.top = '-200px';

			ViewModel.filterBtn.style.display = "inline-block";
			ViewModel.closeFilterBtn.style.display = "none";
		},

		closeFilterOnSelect: function() {
			if ($(window).width() > 1000) {
				ViewModel.closeFilter();
			}
		}
	}; //ViewModel Closing Brace

	ko.applyBindings(ViewModel);

	ViewModel.findLocation();

	ViewModel.subscribeToSearch();

} //initVieModel closing brace