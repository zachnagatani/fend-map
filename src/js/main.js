function preLoad() {
	$(window).load(function() {
		$(".se-pre-con").fadeOut("slow");
	});

}
preLoad();

function googleError() {
	alert('Google maps failed to load. Please refresh the page and try again.');
}

function initApplication() {
	var map;
	var geocoder;
	var userCity = "";
	var userCityGeocode = {};
	var allMarkers = [];
	var infoWindow = new google.maps.InfoWindow({
		content: infoWindowNode
	});
	var foursquareVenueNames = [];

	function venueNames() {
		foursquareVenues.forEach(function(venue){
			foursquareVenueNames.push(venue.name);
		});

		console.log(foursquareVenueNames);
	};

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

	styleInfoWindow();

	var ViewModel = {
		foursquareVenues: ko.observableArray([]),
		foursquareVenuesList: ko.observableArray([foursquareVenues]),
		markerList: ko.observableArray([allMarkers]),
		query: ko.observable(''),
		foursquareVenuesFilter: ko.observable(),

		stopRefreshOnEnter: $(function() {
		  	  $("form").submit(function() { return false; });
			}),

		subscribeToSearch: function() {
			ViewModel.query.subscribe(ViewModel.search);
		},

		search: function(value) {
			allMarkers.forEach(function(marker) {
				marker.setVisible(false);
			});

			allMarkers.forEach(function(marker){
				if (marker.title.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
					marker.setVisible(true);
				}
			});

			ViewModel.foursquareVenues.removeAll();
			foursquareVenues.forEach(function(venue){
				if (venue.categories[0].name.toLowerCase().indexOf(value.toLowerCase()) >= 0 || venue.name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
					ViewModel.foursquareVenues.push(venue);
				}
			});
		},

		venueName: ko.observable(),

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
			if ($(window).width() < 768) {
				ViewModel.closeNav();
			}
		},

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

		openInfoWindow: function(index) {
			ViewModel.infoWindowNode.style.display = "block";

			ViewModel.venueName(ViewModel.foursquareVenues()[index].name);

			// Grab the name from the venue to grab the correct index
			var indexByName = foursquareVenueNames.indexOf(ViewModel.venueName());

			// Use correct index, otherwise index will be wrong when filter is in place
			infoWindow.open(map, allMarkers[indexByName]);
			function getFourSquare() {
				var venueID = ViewModel.foursquareVenues()[index].id;
				var foursquareURL = "https://api.foursquare.com/v2/venues/" + venueID + "?client_id=2DV1P3YPGYBLCEXLTRGNBKZR2EHZINKEHVET2TCUFQFQ23KS&client_secret=EFDTVXXZJSBEVC12RAMZBV24RFUDEY3E1CG2USRDT0NWEK1A&v=20170101&m=foursquare";
				$.ajax({
					dataType: "jsonp",
					url: foursquareURL
				}).done(function(data) {
					console.log(data);
					var venueInfo = data.response.venue;
					ViewModel.venuePrice(venueInfo.attributes.groups[0].summary);
					ViewModel.foursquareLocation(venueInfo.location.address + " " + venueInfo.location.city + ", " + venueInfo.location.state);
					var googleDirectionsURL = "http://maps.google.com/maps?saddr=" + userCity + "&daddr=" + venueInfo.location.address + venueInfo.location.city + venueInfo.location.state;
					ViewModel.googleDirections(googleDirectionsURL);
					ViewModel.foursquareURL(venueInfo.url);
					ViewModel.foursquareContact(venueInfo.contact.formattedPhone);
					ViewModel.foursquareStatus(venueInfo.hours.status);
					if (venueInfo.rating !== undefined) {
						ViewModel.foursquareRating(venueInfo.rating);
					}

					$('#foursquare-rating').css({
						background: '#' + venueInfo.ratingColor
					});

				}).fail(function() {
					ViewModel.foursquareError(true);
					ViewModel.venuePrice('');
					ViewModel.foursquareLocation('');;
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
			}
			getFourSquare();

			allMarkers[indexByName].setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function() {
				allMarkers[indexByName].setAnimation(null);
			}, 750);
		},

		userAddress: ko.observable(),

		initMap: function() {
			geocoder = new google.maps.Geocoder();

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
					ViewModel.infoWindowNode.style.display = "block";
					infoWindow.open(map, marker);
				}

				function getFourSquare() {
					ViewModel.venueName(marker.title);
					var venueID = location.id;
					var foursquareURL = "https://api.foursquare.com/v2/venues/" + venueID + "?client_id=2DV1P3YPGYBLCEXLTRGNBKZR2EHZINKEHVET2TCUFQFQ23KS&client_secret=EFDTVXXZJSBEVC12RAMZBV24RFUDEY3E1CG2USRDT0NWEK1A&v=20170101&m=foursquare";
					$.ajax({
						dataType: "jsonp",
						url: foursquareURL
					}).done(function(data) {
						console.log(data);
						var venueInfo = data.response.venue;
						ViewModel.venuePrice(venueInfo.attributes.groups[0].summary);
						ViewModel.foursquareLocation(venueInfo.location.address + " " + venueInfo.location.city + ", " + venueInfo.location.state);
						var googleDirectionsURL = "http://maps.google.com/maps?saddr=" + userCity + "&daddr=" + venueInfo.location.address + venueInfo.location.city + venueInfo.location.state;
						ViewModel.googleDirections(googleDirectionsURL);
						ViewModel.foursquareURL(venueInfo.url);
						ViewModel.foursquareContact(venueInfo.contact.formattedPhone);
						ViewModel.foursquareStatus(venueInfo.hours.status);
						if (venueInfo.rating !== undefined) {
							ViewModel.foursquareRating(venueInfo.rating);
						}

						$('#foursquare-rating').css({
							background: '#' + venueInfo.ratingColor
						});

					}).fail(function() {
						ViewModel.foursquareError(true);
						console.log(foursquareError());
						ViewModel.venuePrice('');
						ViewModel.foursquareLocation('');;
						ViewModel.googleDirections('');
						ViewModel.foursquareURL('');
						ViewModel.foursquareContact('');
						ViewModel.foursquareStatus('');
						ViewModel.foursquareRating('');

						$('#foursquare-rating').css({
							background: '#fff',
						});

						alert("Foursquare could not be reached at this time.");
					});

				}

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

				marker.addListener('click', function() {
					createInfoWindow();
					getFourSquare();
					toggleBounce();
				});
			});
		},

		introSearchInput: ko.observable(""),

		introSearch: function() {
			userCity = ViewModel.introSearchInput();
			function getFoursquareVenues() {
				var foursquareVenuesURL = "https://api.foursquare.com/v2/venues/explore?near=" + ViewModel.introSearchInput() + "&section=food&limit=50&client_id=2DV1P3YPGYBLCEXLTRGNBKZR2EHZINKEHVET2TCUFQFQ23KS&client_secret=EFDTVXXZJSBEVC12RAMZBV24RFUDEY3E1CG2USRDT0NWEK1A&v=20170101&m=foursquare";
				$.ajax({
					dataType: "jsonp",
					url: foursquareVenuesURL
				}).done(function(data) {
					if (!data.response.groups) {
						alert('Error! Please enter a properly formatted address or city.');
					} else {
						var foursquareVenueResponseArray = data.response.groups[0].items;
						foursquareVenueResponseArray.forEach(function(venue) {
							foursquareVenues.push(venue.venue);
						});
						ViewModel.initMap();
						var closeSearch = function() {
							var introSearchContainer = document.getElementById('intro-search-container');
							introSearchContainer.style.opacity = "0";
							var displayTimeout = setTimeout(function() {
								introSearchContainer.style.display = "none";
							}, 1000);
						};
						closeSearch();
						(function() {
							foursquareVenues.forEach(function(venue) {
								ViewModel.foursquareVenues.push(venue);
							});
							console.log(ViewModel.foursquareVenues());
						})();
						ViewModel.userAddress(userCity);
						venueNames();
					}

				}).fail(function() {
					alert("Sorry; the Foursquare servers could not be reached.");
				});
			}
			getFoursquareVenues();
		},
	}; //ViewModel Closing Brace

	ko.applyBindings(ViewModel);

	ViewModel.subscribeToSearch();

} //initApplication Closing Brace