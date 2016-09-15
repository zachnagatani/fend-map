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
		findLocation: function() {
			if (!navigator.geolocation) return;

			Materialize.toast('Finding your location...', 1000);
			var output = $('#intro-search-input');
			function success(position) {
				var latitude = position.coords.latitude;
				var longitude = position.coords.longitude;
				fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&key=AIzaSyDstwW4Ea6RJFKBuw2hj2kHXAcFioor_2o').then(function(response) {
					return response.json();
				}).then(function(results) {
					var indexEnd = results.results[0].formatted_address.search(", USA");
					ViewModel.introSearchInput(results.results[0].formatted_address.substring(0, indexEnd));
					output.val(ViewModel.introSearchInput());

				});
			}
			function error() {
				Materialize.toast('Sorry; we couldn\'t find your location. Please make sure your location services (GPS) are enabled.', 4000);
			}
			navigator.geolocation.getCurrentPosition(success, error, {enableHighAccuracy: true, timeout: 30000, maximumAge: 0});
		},

		introSearch: function() {

			userCity = ViewModel.introSearchInput();

			var introURL = "https://api.foursquare.com/v2/venues/explore?near=" + ViewModel.introSearchInput() +
			"&section=food&limit=20&client_id=2DV1P3YPGYBLCEXLTRGNBKZR2EHZINKEHVET2TCUFQFQ23KS&client_secret=EFD" +
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
				Materialize.toast("Sorry; the Foursquare servers could not be reached.", 2000);				
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
				zoomVal = 12;
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
					venueInfo.location.address + "+" + venueInfo.location.city + "+" + venueInfo.location
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
				$('#modal1').openModal();
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

				Materialize.toast("Sprry; Foursquare could not be reached at this time for venue info.", 2000);
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