// Create one global instance if InfoWindow
// This allows the infoWindow to auto close upon a different
// location being selected
var infoWindow = new google.maps.InfoWindow({
		    	content: infoWindowNode
});

// http://en.marnoto.com/2014/09/5-formas-de-personalizar-infowindow.html
google.maps.event.addListener(infoWindow, 'domready', function() {

   // Reference to the DIV which receives the contents of the infowindow using jQuery
   var iwOuter = $('.gm-style-iw');

   /* The DIV we want to change is above the .gm-style-iw DIV.
    * So, we use jQuery and create a iwBackground variable,
    * and took advantage of the existing reference to .gm-style-iw for the previous DIV with .prev().
    */
   var iwBackground = iwOuter.prev();

   // Remove the background shadow DIV
   iwBackground.children(':nth-child(2)').css({'display' : 'none'});

   // Remove the white background DIV
   iwBackground.children(':nth-child(4)').css({'display' : 'none'});

   iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': 'rgba(1,156,222,.75) 0px 1px 6px', 'z-index' : '1'});


   // iwOuter.parent().parent().css({left: '115px'});

   iwBackground.children(':nth-child(3)').find('div').children().css({'z-index' : '1'});

   // Taking advantage of the already established reference to
	// div .gm-style-iw with iwOuter variable.
	// You must set a new variable iwCloseBtn.
	// Using the .next() method of JQuery you reference the following div to .gm-style-iw.
	// Is this div that groups the close button elements.
	var iwCloseBtn = iwOuter.next();

	var iwCloseBtnX = iwCloseBtn.next();

	// Apply the desired effect to the close button
	iwCloseBtn.css({
	  width: "25px",
	  height: "25px",
	  opacity: '1', // by default the close button has an opacity of 0.7
	  right: '-75px', top: '6px', // button repositioning
	  border: '1px solid #019CDE', // increasing button border and new color
	  'border-radius': '13px', // circular effect
	  'box-shadow': '0 0 5px #f0f0f0', // 3D effect to highlight the button
	  background: '#fff'
	  });

	// Hide Image Used By Default for X in close button
	iwCloseBtn.children(':nth-child(1)').css({
		top: '-330px',
		left: '3px'
	});

	// The API automatically applies 0.7 opacity to the button after the mouseout event.
	// This function reverses this event to the desired value.
	iwCloseBtn.mouseout(function(){
	  $(this).css({opacity: '1'});
	});


});


// KO ViewModel
var ViewModel = {

	foursquareVenues: ko.observableArray([]),

	foursquareVenuesList: ko.observableArray([foursquareVenues]),

	markerList: ko.observableArray([allMarkers]),

	query: ko.observable(''),

	subscribeToSearch: function() {
		ViewModel.query.subscribe(ViewModel.search);
	},

	search: function() {
		// Marker functionality must be before the list filtering... for some reason
		// TODO: Figure out why ^^^

		// Set the map to null for each marker, removing them from the map
		allMarkers.forEach(function(marker) {

			marker.setMap(null);

		});

		// If the marker.title matches the query, set the map to map (global map variable)
		// thus displaying the marker on the page
		for (var x in allMarkers) {

			if (allMarkers[x].title.toLowerCase().indexOf(value.toLowerCase()) >= 0) {

				allMarkers[x].setMap(map);

			}

		}

		// Grab the listItems from the DOM and store in array
		// TODO: Maybe move out of function. Analyze and optimize if needed
		var listItemsList = document.getElementsByClassName('listItem');

		// Set each listItem's display property to none, removing them
		// from the view
		for (var i = 0; i < listItemsList.length; i++) {

			listItemsList[i].style.display = "none";

		}

		// Loop through the listItemsList and add them back to the view
		// if they match the search query entered by the user
		for (var i in listItemsList) {


			if (foursquareVenues[i].categories[0].name.toLowerCase().indexOf(value.toLowerCase()) >= 0 || listItemsList[i].textContent.toLowerCase().indexOf(value.toLowerCase()) >= 0) {

				// Match the display for the class .listItem in style.css
				listItemsList[i].style.display = "flex";

			}

		}

	},

	venueName: ko.observable(),

	openNav: function() {
		// Move the nav back into view on mobile
		document.getElementById('listContainer').style = "left: 0";

		// Push the map over to match the nav and stay in view
		document.getElementById('mapContainer').style = "transition: 1s; left: 135px";
	},

	closeNav: function() {
		// Move the navbar out of sight
		document.getElementById('listContainer').style = "left: -230px";

		// Move the map back along with the navbar
		document.getElementById('mapContainer').style = "transition: .25s; left: 0px";
	},

	closeNavOnSelect: function() {
		// Close the nav if li is clicked on mobile
		// Check if the width of the window is 768px (mobile)
		if ($(window).width() < 768) {
			ViewModel.closeNav();
		}
	},

	venuePrice: ko.observable(),
	foursquareLocation: ko.observable(),
	foursquareWebsite: ko.observable(),
	foursquareContact: ko.observable(),
	foursquareStatus: ko.observable(),
	foursquareRating: ko.observable(),

	infoWindowNode: document.getElementById('infoWindowNode'),

	infoWindowHeader: document.getElementById('infoWindowHeader'),

	openInfoWindow: function(index) {

		// TODO: Change all the zeroes back to listItemIndex but figure out how to freaking call this thing yo! It has to do with the data-binding $index()

		ViewModel.infoWindowNode.style.display = "block";
		// Remove the location's name from the infoWindow
		// $("#infoWindowName").remove();

		// Grab the index of the clicked list item
		// http://stackoverflow.com/questions/13237058/get-index-of-the-clicked-element-in-knockout
		var listItemIndex = index;

		// Grab the name of the location from the model

		// Update the IW header via data-bind
		ViewModel.venueName(ViewModel.foursquareVenues()[listItemIndex].name);

		// Set the textContent of the infoWindowName to match the location name
		// The index of the li will always match the index of the locationData
		// ViewModel.infoWindowName.textContent = listItemName;
		// ViewModel.infoWindowHeader.appendChild(ViewModel.infoWindowName);

		// Open the infoWindow on our map and over the correct marker
		// The index of the li will always match the index of the allMarkers array
		infoWindow.open(map, allMarkers[listItemIndex]);

		// Foursquare api
		function getFourSquare() {

			// Grab the venueID for the location - necessary to access API
			var venueID = ViewModel.foursquareVenues()[listItemIndex].id;

			// Create the proper URL for the Foursquare API according to the docs
			var foursquareURL = "https://api.foursquare.com/v2/venues/" + venueID + "?client_id=2DV1P3YPGYBLCEXLTRGNBKZR2EHZINKEHVET2TCUFQFQ23KS&client_secret=EFDTVXXZJSBEVC12RAMZBV24RFUDEY3E1CG2USRDT0NWEK1A&v=20170101&m=foursquare";

			// Request data
			$.ajax({
				dataType: "jsonp",
				url: foursquareURL
			}).done(function(data) {

				// Log the data for testing
				console.log(data);

				// $('#infoWindowContentContainer').remove();
				// $('#infoWindowNode').append('<div id="infoWindowContentContainer" class="infoWindowContentContainer"></div>');

				// If no venue key exists in the response, let the user
				// that no Foursquare data exists for the location
				if (!("venue" in data.response)) {

					// Remove any previous Foursquare data appended to the infoWindow
					$('#infoWindowContentContainer').empty();

					// Error message
					$('#infoWindowContentContainer').append("<h3 id='foursquareError'>Sorry! Foursquare data could not be found for this location.");

				} else {

					// Grab the venue from the response info for reasy access
					var venueInfo = data.response.venue;

					// Grab the first photo of the venue in the response
					var photoGrab = data.response.venue.photos.groups[0].items[0];

					ViewModel.infoWindowNode.style.background = "url('" + photoGrab.prefix + photoGrab.width + "x" + photoGrab.height + photoGrab.suffix + "') no-repeat fixed center";

					ViewModel.venuePrice(venueInfo.attributes.groups[0].summary);

					ViewModel.foursquareLocation(venueInfo.location.address + " " + venueInfo.location.city + ", " + venueInfo.location.state);

					document.getElementById('foursquareLink').setAttribute("href", venueInfo.url);

					ViewModel.foursquareContact(venueInfo.contact.formattedPhone);

					ViewModel.foursquareStatus(venueInfo.hours.status);

					if (venueInfo.rating != undefined) {
						ViewModel.foursquareRating(venueInfo.rating);
					}

					$('#foursquareRating').css({
						background: '#' + venueInfo.ratingColor
					});

				}

				// If no response, let the user know
			}).fail(function() {

				// Remove any previous 4sq info from the infoWindow
				$('#infoWindowContentContainer').empty();

				//Error message
				$("#infoWindowContentContainer").append("<h3>Foursquare could not be reached at this time.</h3>");

			});

		}

		// Call relevant API functions
		getFourSquare();

		// If there is animation, set it to none, else
		// set it to the bounce animation
		if (allMarkers[0].getAnimation() !== null) {

			allMarkers[0].setAnimation(null);

		} else {

			allMarkers[0].setAnimation(google.maps.Animation.BOUNCE);

			// Only bounce the pin one time
			// http://stackoverflow.com/questions/7339200/bounce-a-pin-in-google-maps-once
			setTimeout(function() {
				allMarkers[0].setAnimation(null);
			}, 750);

		}

	},

	userAddress: ko.observable(),

	poo: function(){
		ViewModel.openInfoWindow();
	},

	alertMeBaby: function() {
		var poo = "doo";
		alert(poo);
	},

	// Initialize the map on load
	initMap: function(){

		geocoder = new google.maps.Geocoder();
		// Location for map to be centered on
		// Snippet taken from: https://gist.github.com/magnificode/6113759
		var mapCenter = {lat: 37.3036, lng: -121.8974};

		// Create the map instance
		map = new google.maps.Map(document.getElementById('mapContainer'), {

			// Center it in location of choosing
			center: mapCenter,
			// Neighborhood level zoom
			zoom: 14
		});

		if(geocoder) {
			geocoder.geocode({'address': userCity}, function(results, status){
				if(status == google.maps.GeocoderStatus.OK) {
					if(status != google.maps.GeocoderStatus.ZERO_RESULTS) {
						map.setCenter(results[0].geometry.location);
						userCityGeocode = results[0].geometry.location;
					}
				}
			});
		}

		// Call createMarkers()
		ViewModel.createMarkers();

		// Recenter map on window resize - responsive centering
		google.maps.event.addDomListener(window, 'resize', function() {
	    	map.setCenter(userCityGeocode);
		});

		// Recenter map on window resize - responsive centering
		google.maps.event.addDomListener(window, 'scroll', function() {
		});


	},

// document.getElementById('introSearchButton').addEventListener('click', function(){
// 	ViewModel.introSearch();
// });

	createMarkers: function(){

		// Grab the infowWindow div from the DOM
		var infoWindowNode = document.getElementById('infoWindowNode');
		var infoWindowHeader = document.getElementById('infoWindowHeader');

		// Create the element to hold title of location
		var infoWindowName = document.createElement('h1');
		infoWindowName.id = "infoWindowName";

		// Grab all listItems from DOM and store in Array
		var listList = document.getElementsByClassName('listItem');

		// Variable for looping through listList
		var listListLength = listList.length;

		// Create a new GMaps marker for each location in model.js
		// locationData.forEach(function(location){

		// 	var marker = new google.maps.Marker({

		// 		// Set the position to the location's lat and lng
		// 	    position: location.coordinates,

		// 	    // Set the marker on our map
		// 	    map: map,

		// 	    // Give the marker a title matching the location name
		// 	    title: location.name,

		// 	    // No animation on load
		// 	    animation: null,

		// });

		foursquareVenues.forEach(function(location){

			location.coordinates = {"lat": location.location.lat,"lng": location.location.lng};

				var marker = new google.maps.Marker({

				// Set the position to the location's lat and lng
				position: location.coordinates,

				// Set the marker on our map
				map: map,

				// Give the marker a title matching the location name
				title: location.name,

				// No animation on load
				animation: google.maps.Animation.DROP,

			});

			// Push each marker created into the global allMarkers array
			allMarkers.push(marker);

			function createInfoWindow(){
				// Remove the location name when infoWindow is repopulated with info
				// $("#infoWindowName").remove();

				// Set the infoWindowName to the new location's name
				// infoWindowName.textContent = location.name;
				// Append the correct name to the infoWindow
				// infoWindowHeader.appendChild(infoWindowName);

				// Open the infoWindow on our map and over the correct marker

				ViewModel.infoWindowNode.style.display = "block";

				infoWindow.open(map, marker);
			};

			// WikiPedia API
			// function getWiki(){
			// 	// Create the correct URL from the Wikipedia API according to the docs
			// 	var wikiURL = "https://en.wikipedia.org/w/api.php?action=query&titles=" + location.name + "&prop=revisions&rvprop=content&format=json";

			// 	// Create a timeout for error handling if no response is received within 5 seconds
			// 	var wikiRequestTimeout = setTimeout(function(){
			// 	       	$("#infoWindowNode").append("<h3 id='wikiTitle'>Failed to get WikiPedia sources.</h3>");
			// 	    }, 5000);

			// 	// Request the resources
			// 	$.ajax({
			// 		dataType: "jsonp",
			// 		url: wikiURL
			// 	}).done(function(data){

			// 		// Log the response to the console for testing
			// 		console.log(data);

			// 		// Store the correct place of response in a variable for easy access
			// 		var wikiObject = data.query.pages[Object.keys(data.query.pages)[0]];

			// 		// Grab the title of the Wikipedia Article
			// 		var wikiTitle = wikiObject.title;

			// 		// Remove any previous title
			// 		$('#wikiTitle').remove();

			// 		// Check if wikipedia's missing key does not exist
			// 		// If not present, link to the article, or else
			// 		// let the user know there are no articles
			// 		if (!("missing" in wikiObject)){
			// 			// Success
			// 			$('#infoWindowNode').append("<h3 id='wikiTitle'>Read All About: <a target=_blank href='https://en.wikipedia.org/wiki/" + wikiTitle + "'>" + wikiTitle + "</a>!</h3>");
			// 		} else {
			// 			// Error
			// 			$("#infoWindowNode").append("<h3 id='wikiTitle'>Sorry; there are no WikiPedia articles for this location.</h3>");

			// 		}

			// 		// Since the request was successful, stop the
			// 		// timeout request from above
		 //        	clearTimeout(wikiRequestTimeout);

			// 	}).fail(function(data){

			// 		// If no response, let the user know
			// 		alert("Failed to get WikiPedia resources.");

			// 	});
			// };

			// Foursquare api
			function getFourSquare(){

				ViewModel.venueName(marker.title);


				// Grab the venueID for the location - necessary to access API
				var venueID = location.id;

				// Create the proper URL for the Foursquare API according to the docs
				var foursquareURL = "https://api.foursquare.com/v2/venues/" + venueID + "?client_id=2DV1P3YPGYBLCEXLTRGNBKZR2EHZINKEHVET2TCUFQFQ23KS&client_secret=EFDTVXXZJSBEVC12RAMZBV24RFUDEY3E1CG2USRDT0NWEK1A&v=20170101&m=foursquare";


				// Request data
				$.ajax({
					dataType: "jsonp",
					url: foursquareURL
				}).done(function(data){

					// Log the data for testing
					console.log(data);

					// $('#infoWindowContentContainer').remove();
					// $('#infoWindowNode').append('<div id="infoWindowContentContainer" class="infoWindowContentContainer"></div>');

					// If no venue key exists in the response, let the user
					// that no Foursquare data exists for the location
					if(!("venue" in data.response)) {

					// Remove any previous Foursquare data appended to the infoWindow
					// $('#foursquareLocation, #foursquareLink, #foursquareImg, #foursquareError, #foursquareRating, #foursquareRatingHeader, #foursquareStatus').remove();

					// Remove any previous Foursquare data appended to the infoWindow
					$('#infoWindowContentContainer').empty();

					// Error message
					$('#infoWindowContentContainer').append("<h3 id='foursquareError'>Sorry! Foursquare data could not be found for this location.");

					} else {

						// Grab the venue from the response info for easy access
						var venueInfo = data.response.venue;

						// Grab the first photo of the venue in the response
						var photoGrab = data.response.venue.photos.groups[0].items[0];

						ViewModel.infoWindowNode.style.background = "url('" + photoGrab.prefix + photoGrab.width + "x" + photoGrab.height + photoGrab.suffix + "') no-repeat fixed center";

						ViewModel.venuePrice(venueInfo.attributes.groups[0].summary);

						ViewModel.foursquareLocation(venueInfo.location.address + " " + venueInfo.location.city + ", " + venueInfo.location.state);

						document.getElementById('foursquareLink').setAttribute("href", venueInfo.url);

						ViewModel.foursquareContact(venueInfo.contact.formattedPhone);

						ViewModel.foursquareStatus(venueInfo.hours.status);

						if (venueInfo.rating != undefined) {
						ViewModel.foursquareRating(venueInfo.rating);
						}

						$('#foursquareRating').css({
							background: '#' + venueInfo.ratingColor
						});





						// Remove any previous Foursquare data appended to the infoWindow
						// $('#foursquareLocation, #foursquareLink, #foursquareImg, #foursquareError, #foursquareRating, #foursquareRatingHeader, #foursquareStatus, #foursquareContact, #foursquarePrice').remove();

						// $('#infoWindowContentContainer').append("<h3 id='foursquarePrice' class='foursquarePrice'>" + venueInfo.attributes.groups[0].summary + "</h3>");

						// // Append the address from 4sq to the infoWindow
						// $('#infoWindowContentContainer').append("<h2 id='foursquareLocation'>" + venueInfo.location.address + " " + venueInfo.location.city + ", " + venueInfo.location.state + "</h2>");

						// // Append the website from 4sq to the infoWindow
						// $('#infoWindowContentContainer').append("<a target='_blank' id='foursquareLink' class='foursquareLink' href='" + venueInfo.url + "'>" + "Visit Website</a>");

						// $('#infoWindowContentContainer').append("<p id='foursquareContact' class='foursquareContact'>" + venueInfo.contact.formattedPhone + "</p>");

						// // Append the first image from 4sq to the infoWindow
						// // $('#infoWindowNode').append("<img id='foursquareImg' class='infoWindowImg' src='" + photoGrab.prefix + photoGrab.width + "x" + photoGrab.height + photoGrab.suffix + "'>");

						// infoWindowNode.style.background = "url('" + photoGrab.prefix + photoGrab.width + "x" + photoGrab.height + photoGrab.suffix + "') no-repeat fixed center";

						// $('#infoWindowContentContainer').append("<p id='foursquareStatus' class='foursquareStatus'>" + venueInfo.hours.status + "</p>");

						// if(venueInfo.rating != undefined) {
						// 	$('#infoWindowContentContainer').append("<h3 id='foursquareRatingHeader' class='foursquareRatingHeader'>Foursquare Rating: " + "<span id='foursquareRating' class='foursquareRating'>" + venueInfo.rating + "</span></h3>");
						// }

						// $('#foursquareRating').css({
						// 	background: '#' + venueInfo.ratingColor
						// });

					}

				  // If no response, let the user know
				}).fail(function(){

					// Remove any previous 4sq info from the infoWindow
					$('#foursquareLocation, #foursquareLink, #foursquareImg, #foursquareError, #foursquareRating, #foursquareRatingHeader, #foursquareStatus, #foursquareContact, #foursquarePrice').remove();

					//Error message
					$("#infoWindowNode").append("<h3>Foursquare could not be reached at this time.</h3>");

				});

				// getWiki();

			};

			// https://developers.google.com/maps/documentation/javascript/markers#animate
			// Animate marker when selected
			function toggleBounce() {

				// If there is animation, set it to none, else
				// set it to the bounce animation
				if (marker.getAnimation() !== null) {

					marker.setAnimation(null);

				} else {

					marker.setAnimation(google.maps.Animation.BOUNCE);

					// Only bounce the pin one time
					// http://stackoverflow.com/questions/7339200/bounce-a-pin-in-google-maps-once
					setTimeout(function(){ marker.setAnimation(null); }, 750);

				}
			}

			// Add click event to each marker that calls relevant functions
			marker.addListener('click', function(){

				createInfoWindow();

				getFourSquare();

				// ViewModel.openInfoWindow();

				toggleBounce();

			});

		});

	},

	introSearch: function() {

		var introSearchInput = document.getElementById('introSearchInput');
		userCity = introSearchInput.value;

		function getFoursquareVenues() {

			var foursquareVenuesURL = "https://api.foursquare.com/v2/venues/explore?near=" + introSearchInput.value + "&section=food&limit=50&client_id=2DV1P3YPGYBLCEXLTRGNBKZR2EHZINKEHVET2TCUFQFQ23KS&client_secret=EFDTVXXZJSBEVC12RAMZBV24RFUDEY3E1CG2USRDT0NWEK1A&v=20170101&m=foursquare";

			$.ajax({

				dataType: "jsonp",
				url: foursquareVenuesURL

			}).done(function(data){

				console.log(data);

				var foursquareVenueResponseArray = data.response.groups[0].items;

				foursquareVenueResponseArray.forEach(function(venue) {

					foursquareVenues.push(venue.venue);

				});

				ViewModel.initMap();

				closeSearch();

				(function(){

					foursquareVenues.forEach(function(venue){
						ViewModel.foursquareVenues.push(venue);
					});

					console.log(ViewModel.foursquareVenues());

				})();

				// Set the value of self.userAddress to the address inputed
				ViewModel.userAddress(userCity);

				function closeSearch() {

					var introSearchContainer = document.getElementById('introSearchContainer');

					// Use opacity so that the div can utilize CSS transitions
					introSearchContainer.style.opacity = "0";

					// After one second, change the display to "none" so that
					// the user can access the rest of the app
					var displayTimeout = setTimeout(function() {

						introSearchContainer.style.display = "none";

					}, 1000);

				}

			});

		}

		getFoursquareVenues();

	}

} //ViewModel Closing Brace

ko.applyBindings(ViewModel);

ViewModel.subscribeToSearch();