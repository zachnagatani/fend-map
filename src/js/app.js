/* TODO: DONE
1. Add full-screen map to the page. Check out resume tool and
cross worship center.!
2. Add markers. Check out resume project (I added markers there before)!
3. Create a list with those markers' locations. Check out cat-clicker!
4. Filter option.. figure that out
5. Use others API's to provide info for the markers. Check ajax moving helper project (wikipedia/nytimes info)
6. Animations. Find animation libraries to handle this?
7. Error handling. Check out the ajax moving helper project again for .fail() with jquery ajax/getJSON
*/

/*
Cache ajax requests so they only need to be loaded once?
Refactor code?
Create infowindows in only one spot?
*/


// var Location = function (data){

// 	this.name = ko.observable(data.name);
// 	this.lat = ko.observable(data.lat);
// 	this.lng = ko.observable(data.lng);

// };


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
var ViewModel = function() {

	// Allow for easy access to 'this' aka the ViewModel itself
	var self = this;

	// Create an empty array of locations
	this.locations = [];

	// Push each location from model.js into this.locations
	(function(){
		locationData.forEach(function(location){
			self.locations.push(location);
		});
	})();


// Not using square brackets might have been issue in search for loop for location

	// Push this.locations into Observable Array
	this.locationList = ko.observableArray(this.locations);

	this.foursquareVenues = ko.observableArray([]);

	// Push locationData from model.js into OA
	this.locationData = ko.observableArray(locationData);

	this.foursquareVenuesList = ko.observableArray([foursquareVenues]);

	// Push global marker array into OA
	this.markerList = ko.observableArray([allMarkers]);

	// Create empty string Observable for search functioniality
	this.query = ko.observable('');

	// Live search for filtering list and markers
	// http://opensoul.org/2011/06/23/live-search-with-knockoutjs/
	this.search = function(value){


		// Marker functionality must be before the list filtering... for some reason
		// TODO: Figure out why ^^^

		// Set the map to null for each marker, removing them from the map
		allMarkers.forEach(function(marker) {

			marker.setMap(null);

		});

		// If the marker.title matches the query, set the map to map (global map variable)
		// thus displaying the marker on the page
		for(var x in allMarkers) {

			if(allMarkers[x].title.toLowerCase().indexOf(value.toLowerCase()) >= 0) {

				allMarkers[x].setMap(map);

			}

		}

		// Grab the listItems from the DOM and store in array
		var listItemsList = document.getElementsByClassName('listItem');

		// Set each listItem's display property to none, removing them
		// from the view
		for (var i = 0; i < listItemsList.length; i++) {

			listItemsList[i].style.display = "none";

		}

		// Loop through the listItemsList and add them back to the view
		// if they match the search query entered by the user
		for(var i in listItemsList) {


			if(foursquareVenues[i].categories[0].name.toLowerCase().indexOf(value.toLowerCase()) >= 0 || listItemsList[i].textContent.toLowerCase().indexOf(value.toLowerCase()) >= 0) {

				// Match the display for the class .listItem in style.css
				listItemsList[i].style.display = "flex";

			}

		}

	};

	// Run the search function whenever query is updated
	this.query.subscribe(self.search);

	this.infoWindowName = document.createElement('h1');
	this.infoWindowName.id = "infoWindowName";
	this.infoWindowNode = document.getElementById('infoWindowNode');
	this.infoWindowHeader = document.getElementById('infoWindowHeader');

	// Functionality to open navbar on mobile
	this.openNav = function(){

		// Move the nav back into view on mobile
		document.getElementById('listContainer').style = "left: 0";

		// Push the map over to match the nav and stay in view
		document.getElementById('mapContainer').style = "transition: 1s; left: 135px";

	};

	// Functionality to close navbar on mobile
	this.closeNav = function(){

		// Move the navbar out of sight
		document.getElementById('listContainer').style = "left: -230px";

		// Move the map back along with the navbar
		document.getElementById('mapContainer').style = "transition: .25s; left: 0px";

	};

	this.closeNavOnSelect = function(){

		// Close the nav if li is clicked on mobile
		// Check if the width of the window is 768px (mobile)
		if ($(window).width() < 768) {
		   self.closeNav();
		};

	};

	// var itemIndexes = [];

	// locationData.forEach(function(location){
	// 		var listItemIndex = locationData.indexOf(location);
	// 		itemIndexes.push(listItemIndex);
	// 	});

	// console.log(itemIndexes);

	// Open the instance of InfoWindow from a listItem
	this.openInfoWindow = function(index){

		// Remove the location's name from the infoWindow
		$("#infoWindowName").remove();

		// Grab the index of the clicked list item
		// http://stackoverflow.com/questions/13237058/get-index-of-the-clicked-element-in-knockout
		var listItemIndex = index;

		// Grab the name of the location from the model
		var listItemName = foursquareVenues[listItemIndex].name;

		// Set the textContent of the infoWindowName to match the location name
		// The index of the li will always match the index of the locationData
		self.infoWindowName.textContent = listItemName;
		self.infoWindowHeader.appendChild(self.infoWindowName);

		// Open the infoWindow on our map and over the correct marker
		// The index of the li will always match the index of the allMarkers array
		infoWindow.open(map, allMarkers[listItemIndex]);

		// Foursquare api
		function getFourSquare(){

			// Grab the venueID for the location - necessary to access API
			var venueID = foursquareVenues[index].id;

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
					// $('#infoWindowContentContainer').append("<img id='foursquareImg' class='infoWindowImg' src='" + photoGrab.prefix + photoGrab.width + "x" + photoGrab.height + photoGrab.suffix + "'>");

					// $('#infoWindowContentContainer').append('<div class="iw-bottom-gradient"></div>');

					// $('#infowWindowNode')[0].style.background = "url('" + photoGrab.prefix + photoGrab.width + "x" + photoGrab.height + photoGrab.suffix + ")";

					// var infoWindowContentContainer = document.getElementById('infoWindowContentContainer');

					self.infoWindowNode.style.background = "url('" + photoGrab.prefix + photoGrab.width + "x" + photoGrab.height + photoGrab.suffix + "') no-repeat fixed center";

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
				$("#infoWindowContentContainer").append("<h3>Foursquare could not be reached at this time.</h3>");

			});

		};

		// // WikiPedia API
		// function getWiki(){

		// 	// Create the correct URL from the Wikipedia API according to the docs
		// 	var wikiURL = "https://en.wikipedia.org/w/api.php?action=query&titles=" + listItemName + "&prop=revisions&rvprop=content&format=json";

		// 	// Create a timeout for error handling if no response is received within 5 seconds
		// 	var wikiRequestTimeout = setTimeout(function(){
	 //        	$("#infoWindowNode").append("<h3 id='wikiTitle'>Failed to get WikiPedia sources.</h3>");
	 //   		}, 5000);

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

		// Call relevant API functions
		getFourSquare();
		// getWiki();

		// If there is animation, set it to none, else
		// set it to the bounce animation
		if (allMarkers[listItemIndex].getAnimation() !== null) {

				allMarkers[listItemIndex].setAnimation(null);

			} else {

				allMarkers[listItemIndex].setAnimation(google.maps.Animation.BOUNCE);

				// Only bounce the pin one time
				// http://stackoverflow.com/questions/7339200/bounce-a-pin-in-google-maps-once
				setTimeout(function(){ allMarkers[listItemIndex].setAnimation(null); }, 750);

		}

	};

	this.introSearch = function() {

		var introSearchInput = document.getElementById('introSearchInput');
		userCity = introSearchInput.value;

		function getFoursquareVenues(){

			var foursquareVenuesURL = "https://api.foursquare.com/v2/venues/explore?near=" + introSearchInput.value + "&section=food&client_id=2DV1P3YPGYBLCEXLTRGNBKZR2EHZINKEHVET2TCUFQFQ23KS&client_secret=EFDTVXXZJSBEVC12RAMZBV24RFUDEY3E1CG2USRDT0NWEK1A&v=20170101&m=foursquare";

			$.ajax({
				dataType: "jsonp",
				url: foursquareVenuesURL

			}).done(function(data){
				console.log(data);

				var foursquareVenueResponseArray = data.response.groups[0].items;

				foursquareVenueResponseArray.forEach(function(venue){

					foursquareVenues.push(venue.venue);

				});

				initMap();

				closeSearch();

					(function(){

						foursquareVenues.forEach(function(venue){
							self.foursquareVenues.push(venue);
						});

						console.log(self.foursquareVenues());

					})();

			});

		};

		function closeSearch() {

			var introSearchContainer = document.getElementById('introSearchContainer');

			// Use opacity so that the div can utilize CSS transitions
			introSearchContainer.style.opacity = "0";

			// After one second, change the display to "none" so that
			// the user can access the rest of the app
			var displayTimeout = setTimeout(function(){

				introSearchContainer.style.display = "none";

			}, 1000);

		}

		getFoursquareVenues();

	};

};

ko.applyBindings(new ViewModel());
