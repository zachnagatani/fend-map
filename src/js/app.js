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

// KO ViewModel
var ViewModel = function() {

	// Allow for easy access to 'this' aka the ViewModel itself
	var self = this;

	// this.locationList = ko.observableArray(locationData);

	// // locationData.forEach(function(location){
	// // 	self.locationList.push(new Location(location));
	// // });

	// this.locations = ko.observableArray(locationData);
	// this.query = ko.observable('');

	// this.search = function(value){
	// 	// self.locationList.removeAll();

	// 	for(var x in self.locationList()){
	// 		if(self.locationList()[x].name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
	// 			self.locationList.push(self.locationList()[x]);
	// 		}
	// 	}

	// 	// console.log(self.locationList()[1].name.toLowerCase().indexOf(value.toLowerCase()));

	// 	// self.locationList.forEach(function(location){
	// 	// 	if(location.name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
	// 	// 		self.locationList.push(location);
	// 	// 	}
	// 	// });
	// };

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

	// Push locationData from model.js into OA
	this.locationData = ko.observableArray(locationData);

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
		for(var x in listItemsList) {

			if(listItemsList[x].textContent.toLowerCase().indexOf(value.toLowerCase()) >= 0) {

				// Match the display for the class .listItem in style.css
				listItemsList[x].style.display = "table";

			}

		}

	};

	// Run the search function whenever query is updated
	this.query.subscribe(self.search);

	this.infoWindowName = document.createElement('h1');
	this.infoWindowName.id = "infoWindowName";
	this.infoWindowNode = document.getElementById('infoWindowNode');

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
		var listItemName = locationData[listItemIndex].name;

		// Set the textContent of the infoWindowName to match the location name
		// The index of the li will always match the index of the locationData
		self.infoWindowName.textContent = listItemName;
		self.infoWindowNode.appendChild(self.infoWindowName);

		// Open the infoWindow on our map and over the correct marker
		// The index of the li will always match the index of the allMarkers array
		infoWindow.open(map, allMarkers[listItemIndex]);

		// WikiPedia API
		// Create the correct URL from the Wikipedia API according to the docs
		var wikiURL = "https://en.wikipedia.org/w/api.php?action=query&titles=" + listItemName + "&prop=revisions&rvprop=content&format=json";

		// Create a timeout for error handling if no response is received within 5 seconds
		var wikiRequestTimeout = setTimeout(function(){
        	$("#infoWindowNode").append("<h3 id='wikiTitle'>Failed to get WikiPedia sources.</h3>");
   		}, 5000);

		// Request the resources
		$.ajax({
			dataType: "jsonp",
			url: wikiURL
		}).done(function(data){

			// Log the response to the console for testing
			console.log(data);

			// Store the correct place of response in a variable for easy access
			var wikiObject = data.query.pages[Object.keys(data.query.pages)[0]];

			// Grab the title of the Wikipedia Article
			var wikiTitle = wikiObject.title;

			// Remove any previous title
			$('#wikiTitle').remove();

			// Check if wikipedia's missing key does not exist
			// If not present, link to the article, or else
			// let the user know there are no articles
			if (!("missing" in wikiObject)){
				// Success
				$('#infoWindowNode').append("<h3 id='wikiTitle'>Read All About: <a target=_blank href='https://en.wikipedia.org/wiki/" + wikiTitle + "'>" + wikiTitle + "</a>!</h3>");
			} else {
				// Error
				$("#infoWindowNode").append("<h3 id='wikiTitle'>Sorry; there are no WikiPedia articles for this location.</h3>");
			}

			// Since the request was successful, stop the
			// timeout request from above
        	clearTimeout(wikiRequestTimeout);

		}).fail(function(data){

			// If no response, let the user know
			alert("Failed to get WikiPedia resources.");

		});

		// Foursquare api
		// Grab the venueID for the location - necessary to access API
		var venueID = locationData[index].foursquareVenueID;

		// Create the proper URL for the Foursquare API according to the docs
		var foursquareURL = "https://api.foursquare.com/v2/venues/" + venueID + "?client_id=2DV1P3YPGYBLCEXLTRGNBKZR2EHZINKEHVET2TCUFQFQ23KS&client_secret=EFDTVXXZJSBEVC12RAMZBV24RFUDEY3E1CG2USRDT0NWEK1A&v=20170101&m=foursquare";

		// Request data
		$.ajax({
			dataType: "jsonp",
			url: "https://api.foursquare.com/v2/venues/" + venueID + "?client_id=2DV1P3YPGYBLCEXLTRGNBKZR2EHZINKEHVET2TCUFQFQ23KS&client_secret=EFDTVXXZJSBEVC12RAMZBV24RFUDEY3E1CG2USRDT0NWEK1A&v=20170101&m=foursquare"
		}).done(function(data){

			// Log the data for testing
			console.log(data);

			// If no venue key exists in the response, let the user
			// that no Foursquare data exists for the location
			if(!("venue" in data.response)) {

				// Remove any previous Foursquare data appended to the infoWindow
				$('#foursquareLocation, #foursquareLink, #foursquareImg, #foursquareError').remove();

				// Error message
				$('#infoWindowNode').append("<h3 id='foursquareError'>Sorry! Foursquare data could not be found for this location.");

			} else {

				// Grab the venue from the response info for reasy access
				var venueInfo = data.response.venue;

				// Grab the first photo of the venue in the response
				var photoGrab = data.response.venue.photos.groups[0].items[0];

				// Remove any previous Foursquare data appended to the infoWindow
				$('#foursquareLocation, #foursquareLink, #foursquareImg, #foursquareError').remove();

				// Append the address from 4sq to the infoWindow
				$('#infoWindowNode').append("<h2 id='foursquareLocation'>" + venueInfo.location.address + " " + venueInfo.location.city + ", " + venueInfo.location.state + "</h2>");

				// Append the website from 4sq to the infoWindow
				$('#infoWindowNode').append("<a target='_blank' id='foursquareLink' class='foursquareLink' href='" + venueInfo.url + "'>" + "Visit Website</a>");

				// Append the first image from 4sq to the infoWindow
				$('#infoWindowNode').append("<img id='foursquareImg' class='infoWindowImg' src='" + photoGrab.prefix + photoGrab.width + "x" + photoGrab.height + photoGrab.suffix + "'>");

			}

		  // If no response, let the user know
		}).fail(function(){

			// Remove any previous 4sq info from the infoWindow
			$('#foursquareLocation, #foursquareLink, #foursquareImg').remove();

			//Error message
			$("#infoWindowNode").append("<h3>Foursquare could not be reached at this time.</h3>");

		});

		if (allMarkers[listItemIndex].getAnimation() !== null) {
				allMarkers[listItemIndex].setAnimation(null);
			} else {
				allMarkers[listItemIndex].setAnimation(google.maps.Animation.BOUNCE);
				// http://stackoverflow.com/questions/7339200/bounce-a-pin-in-google-maps-once
				setTimeout(function(){ allMarkers[listItemIndex].setAnimation(null); }, 750)
		};

		// Close the nav if li is clicked on mobile
		// Check if the width of the window is 768px (mobile)
		if ($(window).width() < 768) {
		   self.closeNav();
		};

	};

};

ko.applyBindings(new ViewModel());







// foursquareURL = https://api.foursquare.com/v2/venues/VENUE_ID

// "https://api.foursquare.com/v2/venues/4a82147ef964a52082f81fe3?client_id=2DV1P3YPGYBLCEXLTRGNBKZR2EHZINKEHVET2TCUFQFQ23KS&client_secret=EFDTVXXZJSBEVC12RAMZBV24RFUDEY3E1CG2USRDT0NWEK1A

