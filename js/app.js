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

var infoWindow = new google.maps.InfoWindow({
		    	content: infoWindowNode
});

var ViewModel = function() {

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

	this.locations = [];

	(function(){
		locationData.forEach(function(location){
			self.locations.push(location);
		});
	})();


// Not using square brackets might have been issue in search for loop for location
	this.locationList = ko.observableArray(this.locations);

	this.locationData = ko.observableArray(locationData);

	this.markerList = ko.observableArray([allMarkers]);

	// locationData.forEach(function(location){
	// 	self.locationList.push(new Location(location));
	// });

	// this.locations = ko.observableArray([]);
	this.query = ko.observable('');
	console.log(this.markerList());

	// http://opensoul.org/2011/06/23/live-search-with-knockoutjs/

	this.search = function(value){


		// Must be before the list filtering... for some reason
		// Set the map to null for each marker

		allMarkers.forEach(function(marker) {
			marker.setMap(null);
		});

		// if the title matches the query, set the map to the global map variable
		// thus displaying the marker on the page

		for(var x in allMarkers) {

			if(allMarkers[x].title.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
				// self.locationList.push(self.locationList()[x]);
				// console.log(locationData[x]);
				// self.locationList.push(locationData[x]);
				allMarkers[x].setMap(map);
			}

		}

		var listItemsFOSHO = document.getElementsByClassName('listItem');
		for (var i = 0; i < listItemsFOSHO.length; i++) {
			listItemsFOSHO[i].style.display = "none";
		}

		for(var x in listItemsFOSHO) {

			if(listItemsFOSHO[x].textContent.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
				// self.locationList.push(self.locationList()[x]);
				// console.log(locationData[x]);
				listItemsFOSHO[x].style.display = "table";
			}

		}

		// for(var x in self.locationData()) {

		// 	if(self.locationData()[x].name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
		// 		// self.locationList.push(self.locationList()[x]);
		// 		// console.log(locationData[x]);
		// 		self.locationList.push(locationData[x]);
		// 	}

		// }



		// self.locationList.removeAll();

		// console.log(self.locationList());

		// console.log(locationData);

		// for(var i = 0; i < self.locationList().length; i++) {
		// 	if(self.locationList()[i].name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
		// 		self.locationList.push(self.locationList()[i]);
		// 	}
		// };

		// console.log(self.locationList()[0].name);

		// console.log(self.locationList()[1].name.toLowerCase().indexOf(value.toLowerCase()));

		// self.locationList.forEach(function(location){
		// 	if(location.name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
		// 		self.locationList.push(location);
		// 	}
		// });
	};

	this.query.subscribe(self.search);

	this.infoWindowName = document.createElement('h1');
	this.infoWindowName.id = "infoWindowName";
	this.infoWindowNode = document.getElementById('infoWindowNode');

	this.getCreateMarkers = function(){
		return createMarkers();
	};

	this.openNav = function(){

		document.getElementById('listContainer').style = "left: 0";
		document.getElementById('mapContainer').style = "transition: 1s; left: 135px";

	};

	this.closeNav = function(){

		document.getElementById('listContainer').style = "left: -230px";
		document.getElementById('mapContainer').style = "transition: .25s; left: 0px";

	};

	// this.getIndexes = function(index){
	// 	var itemIndexes = [];
	// 	for (var i = 0; i < locationData.length; i++) {
	// 		var listItemIndex = index;
	// 		itemIndexes.push(listItemIndex);
	// 	}
	// 	console.log(itemIndexes);
	// }

	var itemIndexes = [];

	locationData.forEach(function(location){
			var listItemIndex = locationData.indexOf(location);
			itemIndexes.push(listItemIndex);
		});

	console.log(itemIndexes);


	this.openInfoWindow = function(index, event){

		$("#infoWindowName").remove();

		// for (var i = 0; i < locationData.length; i++) {
		// 	var listItemIndex = index;
		// 	itemIndexes.push(listItemIndex);
		// }
		// Grab the index of the clicked item
		// http://stackoverflow.com/questions/13237058/get-index-of-the-clicked-element-in-knockout
		var listItemIndex = index;

		var target = $(event.target);
		console.log(target);

		// var $eventIndex = self.locationList().indexOf(target);
		// console.log($eventIndex);

		// TODO: Grab the target and find it's index in locationList
		// and pass THAT index in all of the below paramaters
		// console.log(self.locationList().indexOf(self.locationList()[0]));
		// TODO: Capture original index of each listItem, and then use that index to determine
		// what infoWindow will open after a search

		var listItemName = locationData[listItemIndex].name;

		// The index of the li will always match the index of the locationData array
		self.infoWindowName.textContent = locationData[listItemIndex].name;
		self.infoWindowNode.appendChild(self.infoWindowName);

		// The index of the li will always match the index of the allMarkers array
		infoWindow.open(map, allMarkers[listItemIndex]);

		// WikiPedia API
		var wikiURL = "https://en.wikipedia.org/w/api.php?action=query&titles=" + listItemName + "&prop=revisions&rvprop=content&format=json";

		var wikiRequestTimeout = setTimeout(function(){
        	$("#infoWindowNode").append("<h3 id='wikiTitle'>Failed to get WikiPedia sources.</h3>");
   		}, 5000);


		$.ajax({
			dataType: "jsonp",
			url: wikiURL
		}).done(function(data){
			console.log(data);

			var wikiObject = data.query.pages[Object.keys(data.query.pages)[0]];
			var wikiTitle = wikiObject.title;

			$('#wikiTitle').remove();

			// Check if wikipedia's missing key exists. If it does, there are no articles
			// so let the user know, else link to the article
			if (!("missing" in wikiObject)){
				$('#infoWindowNode').append("<h3 id='wikiTitle'>Read All About: <a target=_blank href='https://en.wikipedia.org/wiki/" + wikiTitle + "'>" + wikiTitle + "</a>!</h3>");
			} else {
				$("#infoWindowNode").append("<h3 id='wikiTitle'>Sorry; there are no WikiPedia articles for this location.</h3>");
			}
        	clearTimeout(wikiRequestTimeout);
		}).fail(function(data){
			alert("Failed to get WikiPedia resources.");
		});

		// Foursquare api
		var venueID = locationData[index].foursquareVenueID;

		$.ajax({
			dataType: "jsonp",
			url: "https://api.foursquare.com/v2/venues/" + venueID + "?client_id=2DV1P3YPGYBLCEXLTRGNBKZR2EHZINKEHVET2TCUFQFQ23KS&client_secret=EFDTVXXZJSBEVC12RAMZBV24RFUDEY3E1CG2USRDT0NWEK1A&v=20170101&m=foursquare"
		}).done(function(data){
			console.log(data);

			if(!("venue" in data.response)) {
				console.log("MEPOO");
				$('#foursquareLocation, #foursquareLink, #foursquareImg, #foursquareError').remove();
				$('#infoWindowNode').append("<h3 id='foursquareError'>Sorry! Foursquare data could not be found for this location.");

			} else {
				var venueInfo = data.response.venue;
				var photoGrab = data.response.venue.photos.groups[0].items[0];

				$('#foursquareLocation, #foursquareLink, #foursquareImg, #foursquareError').remove();

				$('#infoWindowNode').append("<h2 id='foursquareLocation'>" + venueInfo.location.address + " " + venueInfo.location.city + ", " + venueInfo.location.state + "</h2>");

				$('#infoWindowNode').append("<a target='_blank' id='foursquareLink' class='foursquareLink' href='" + venueInfo.url + "'>" + "Visit Website</a>");

				$('#infoWindowNode').append("<img id='foursquareImg' class='infoWindowImg' src='" + photoGrab.prefix + photoGrab.width + "x" + photoGrab.height + photoGrab.suffix + "'>");
			}

		}).fail(function(){
			$('#foursquareLocation, #foursquareLink, #foursquareImg').remove();
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
		if ($(window).width() < 768) {
		   self.closeNav();
		};

	};

};

ko.applyBindings(new ViewModel());







// foursquareURL = https://api.foursquare.com/v2/venues/VENUE_ID

// "https://api.foursquare.com/v2/venues/4a82147ef964a52082f81fe3?client_id=2DV1P3YPGYBLCEXLTRGNBKZR2EHZINKEHVET2TCUFQFQ23KS&client_secret=EFDTVXXZJSBEVC12RAMZBV24RFUDEY3E1CG2USRDT0NWEK1A

