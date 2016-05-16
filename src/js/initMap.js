// Global map variable, to allow the google maps "map" to be accessible from anywhere
var map;

// Global markers array - accessible from anywhere
var allMarkers = [];

// Initialize the map on load
function initMap(){

	// Location for map to be centered on
	// Snippet taken from: https://gist.github.com/magnificode/6113759
	var mapCenter = {lat: 37.3036, lng: -121.8974};

	// Create the map instance
	map = new google.maps.Map(document.getElementById('mapContainer'), {

		// Center it in location of choosing
		center: mapCenter,
		// Neighborhood level zoom
		zoom: 16
	});

	// Call createMarkers()
	createMarkers();

	// Recenter map on window resize - responsive centering
	google.maps.event.addDomListener(window, 'resize', function() {
    	map.setCenter(mapCenter);
	});

	// Recenter map on window resize - responsive centering
	google.maps.event.addDomListener(window, 'scroll', function() {
	});


};

function createMarkers(){

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
	locationData.forEach(function(location){

		var marker = new google.maps.Marker({

			// Set the position to the location's lat and lng
		    position: location.coordinates,

		    // Set the marker on our map
		    map: map,

		    // Give the marker a title matching the location name
		    title: location.name,

		    // No animation on load
		    animation: null,

	});

		// Push each marker created into the global allMarkers array
		allMarkers.push(marker);

		function createInfoWindow(){
			// Remove the location name when infoWindow is repopulated with info
			$("#infoWindowName").remove();

			// Set the infoWindowName to the new location's name
			infoWindowName.textContent = location.name;
			// Append the correct name to the infoWindow
			infoWindowHeader.appendChild(infoWindowName);

			// Open the infoWindow on our map and over the correct marker
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

			// Grab the venueID for the location - necessary to access API
			var venueID = location.foursquareVenueID;

			// Create the proper URL for the Foursquare API according to the docs
			var foursquareURL = "https://api.foursquare.com/v2/venues/" + venueID + "?client_id=2DV1P3YPGYBLCEXLTRGNBKZR2EHZINKEHVET2TCUFQFQ23KS&client_secret=EFDTVXXZJSBEVC12RAMZBV24RFUDEY3E1CG2USRDT0NWEK1A&v=20170101&m=foursquare";


			// Request data
			$.ajax({
				dataType: "jsonp",
				url: foursquareURL
			}).done(function(data){

				// Log the data for testing
				console.log(data);

				$('#infoWindowContentContainer').remove();
				$('#infoWindowNode').append('<div id="infoWindowContentContainer" class="infoWindowContentContainer"></div>');

				// If no venue key exists in the response, let the user
				// that no Foursquare data exists for the location
				if(!("venue" in data.response)) {

				// Remove any previous Foursquare data appended to the infoWindow
				$('#foursquareLocation, #foursquareLink, #foursquareImg, #foursquareError, #foursquareRating, #foursquareRatingHeader, #foursquareStatus').remove();

				// Error message
				$('#infoWindowContentContainer').append("<h3 id='foursquareError'>Sorry! Foursquare data could not be found for this location.");

				} else {

					// Grab the venue from the response info for reasy access
					var venueInfo = data.response.venue;

					// Grab the first photo of the venue in the response
					var photoGrab = data.response.venue.photos.groups[0].items[0];

					// Remove any previous Foursquare data appended to the infoWindow
					$('#foursquareLocation, #foursquareLink, #foursquareImg, #foursquareError, #foursquareRating, #foursquareRatingHeader, #foursquareStatus, #foursquareContact, #foursquarePrice').remove();

					$('#infoWindowContentContainer').append("<h3 id='foursquarePrice' class='foursquarePrice'>" + venueInfo.attributes.groups[0].summary + "</h3>");

					// Append the address from 4sq to the infoWindow
					$('#infoWindowContentContainer').append("<h2 id='foursquareLocation'>" + venueInfo.location.address + " " + venueInfo.location.city + ", " + venueInfo.location.state + "</h2>");

					// Append the website from 4sq to the infoWindow
					$('#infoWindowContentContainer').append("<a target='_blank' id='foursquareLink' class='foursquareLink' href='" + venueInfo.url + "'>" + "Visit Website</a>");

					$('#infoWindowContentContainer').append("<p id='foursquareContact' class='foursquareContact'>" + venueInfo.contact.formattedPhone + "</p>");

					// Append the first image from 4sq to the infoWindow
					// $('#infoWindowNode').append("<img id='foursquareImg' class='infoWindowImg' src='" + photoGrab.prefix + photoGrab.width + "x" + photoGrab.height + photoGrab.suffix + "'>");

					infoWindowNode.style.background = "url('" + photoGrab.prefix + photoGrab.width + "x" + photoGrab.height + photoGrab.suffix + "') no-repeat fixed center";

					$('#infoWindowContentContainer').append("<p id='foursquareStatus' class='foursquareStatus'>" + venueInfo.hours.status + "</p>");

					if(venueInfo.rating != undefined) {
						$('#infoWindowContentContainer').append("<h3 id='foursquareRatingHeader' class='foursquareRatingHeader'>Foursquare Rating: " + "<span id='foursquareRating' class='foursquareRating'>" + venueInfo.rating + "</span></h3>");
					}

					$('#foursquareRating').css({
						background: '#' + venueInfo.ratingColor
					});

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

			toggleBounce();

		});

	});

}