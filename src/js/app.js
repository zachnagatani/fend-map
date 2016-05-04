/* TODO:
1. Add full-screen map to the page. Check out resume tool and
cross worship center.!
2. Add markers. Check out resume project (I added markers there before)!
3. Create a list with those markers' locations. Check out cat-clicker!
4. Filter option.. figure that out
5. Use others API's to provide info for the markers. Check ajax moving helper project (wikipedia/nytimes info)
6. Animations. Find animation libraries to handle this?
7. Error handling. Check out the ajax moving helper project again for .fail() with jquery ajax/getJSON
*/

var locationData = [

	{
		name: "Pizza My Heart",

		foursquareVenueID: "4a82147ef964a52082f81fe3",

		type: "Food",

		coordinates: {

			lat: 37.303856,

			lng: -121.89722,
		}
	},

	{
		name: "Powell's Sweet Shoppe",

		foursquareVenueID: "4b11fc05f964a520d78723e3",

		type: "Food",

		coordinates: {

			lat: 37.307686,

			lng: -121.900156,
		}
	},

	{
		name: "Hicklebee's Bookstore",

		foursquareVenueID: "4a85d37bf964a5205eff1fe3",

		type: "Art",

		coordinates: {

			lat: 37.304035,

			lng: -121.897363,
		}
	},

	{
		name: "AZ Fine Art Gallery",

		foursquareVenueID: "",

		type: "Art",

		coordinates: {

			lat: 37.306385,

			lng: -121.899933,
		}
	},

	{
		name: "Main Street Burgers",

		foursquareVenueID: "54373d95498e5b5416738404",

		type: "Food",

		coordinates: {

			lat: 37.308185,

			lng: -121.900533,
		}
	}

];

var filters = ["No Filter", "Food", "Art"];

var map;
var allMarkers = [];

function initMap(){

	// Location for map to be centered on
	// Snippet taken from: https://gist.github.com/magnificode/6113759
	var mapCenter = {lat: 37.3036, lng: -121.8974};

	map = new google.maps.Map(document.getElementById('mapContainer'), {
		center: mapCenter,
		zoom: 16
	});

	createMarkers();

	google.maps.event.addDomListener(window, 'resize', function() {
    	map.setCenter(mapCenter);
	});

};

function createMarkers(){

	var infoWindowName = document.getElementById('infoWindowName');
	var infoWindowNode = document.getElementById('infoWindowNode');
	var listList = document.getElementsByClassName('listItem');

	var listListLength = listList.length;

	locationData.forEach(function(location){

		var marker = new google.maps.Marker({
		    position: location.coordinates,
		    map: map,
		    title: location.name
		});

		allMarkers.push(marker);

		function createInfoWindow(){
			infoWindowName.textContent = location.name;
			infoWindowNode.appendChild(infoWindowName);

			var infoWindow = new google.maps.InfoWindow({
		    	content: infoWindowNode
			});

			infoWindow.open(map, marker);
		};

		function getWiki(){
			// WikiPedia API
			var wikiURL = "https://en.wikipedia.org/w/api.php?action=query&titles=" + location.name + "&prop=revisions&rvprop=content&format=json";

			$.ajax({
				dataType: "jsonp",
				url: wikiURL
			}).done(function(data){
				console.log(data);

				var wikiObject = data.query.pages[Object.keys(data.query.pages)[0]];
				var wikiTitle = wikiObject.title;

				var wikiRequestTimeout = setTimeout(function(){
			       	$("#infoWindowNode").append("<h3 id='wikiTitle'>Failed to get WikiPedia sources.</h3>");
			    }, 5000);

				$('#wikiTitle').remove();

				// Check if wikipedia's missing key exists. If it does, there are no articles
				// so let the user know, else link to the article
				if (!("missing" in wikiObject)){
					$('#infoWindowNode').append("<h3 id='wikiTitle'>Read All About: <a target=_blank href='https://en.wikipedia.org/wiki/" + wikiTitle + "'>" + wikiTitle + "</a>!</h3>");
				} else {
					$("#infoWindowNode").append("<h3 id='wikiTitle'>Sorry; there are no WikiPedia articles for this location.</h3>")

				}
        	clearTimeout(wikiRequestTimeout);
			});
		};

		function getFourSquare(){
			// Foursquare api
			var venueID = location.foursquareVenueID;

			$.ajax({
				dataType: "jsonp",
				url: "https://api.foursquare.com/v2/venues/" + venueID + "?client_id=2DV1P3YPGYBLCEXLTRGNBKZR2EHZINKEHVET2TCUFQFQ23KS&client_secret=EFDTVXXZJSBEVC12RAMZBV24RFUDEY3E1CG2USRDT0NWEK1A&v=20170101&m=foursquare"
			}).done(function(data){
				console.log(data);

				var venueInfo = data.response.venue;
				var photoGrab = data.response.venue.photos.groups[0].items[0];

				$('#foursquareLocation, #foursquareLink').remove();

				$('#infoWindowNode').append("<h2 id='foursquareLocation'>" + venueInfo.location.address + " " + venueInfo.location.city + ", " + venueInfo.location.state + "</h2>");

				$('#infoWindowNode').append("<a target='_blank' id='foursquareLink' href='" + venueInfo.url + "'>" + "Visit Website</a>");

				$('#infoWindowNode').append("<img class='infoWindowImg' src='" + photoGrab.prefix + photoGrab.width + "x" + photoGrab.height + photoGrab.suffix + "'>");
				getWiki();
			});
		};

		// TODO: Make open infoWindow close on click of another marker
		marker.addListener('click', function(){
			createInfoWindow();
			getFourSquare();
		});

	});

}

var Location = function (data){

	this.name = ko.observable(data.name);
	this.lat = ko.observable(data.lat);
	this.lng = ko.observable(data.lng);

};


var ViewModel = function() {

	var self = this;

	this.locationList = ko.observableArray([]);

	locationData.forEach(function(location){
		self.locationList.push(new Location(location));
	});

	this.getCreateMarkers = function(){
		return createMarkers();
	};

	this.openNav = function(){

		document.getElementById('listContainer').style = "left: 0";
		document.getElementById('mapContainer').style = "transition: 1s; left: 150px";

	};

	this.closeNav = function(){

		document.getElementById('listContainer').style = "left: -230px";
		document.getElementById('mapContainer').style = "transition: .25s; left: 0px";

	};

	this.openInfoWindow = function(index){

		// Grab the index of the clicked item
		// http://stackoverflow.com/questions/13237058/get-index-of-the-clicked-element-in-knockout
		var listItemIndex = index;
		var listItemName = locationData[listItemIndex].name;

		// Launch Google Maps InfoWindow

		var infoWindowName = document.getElementById('infoWindowName');
		var infoWindowNode = document.getElementById('infoWindowNode');


		// The index of the li will always match the index of the locationData array
		infoWindowName.textContent = locationData[listItemIndex].name;
		infoWindowNode.appendChild(infoWindowName);

		var infoWindow = new google.maps.InfoWindow({
	    	content: infoWindowNode
		});

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
				$("#infoWindowNode").append("<h3 id='wikiTitle'>Sorry; there are no WikiPedia articles for this location.</h3>")

			}
        	clearTimeout(wikiRequestTimeout);
		}).error(function(data){
			alert("Failed to get WikiPedia sources.");
		});

	};

};

ko.applyBindings(new ViewModel());







// foursquareURL = https://api.foursquare.com/v2/venues/VENUE_ID

// "https://api.foursquare.com/v2/venues/4a82147ef964a52082f81fe3?client_id=2DV1P3YPGYBLCEXLTRGNBKZR2EHZINKEHVET2TCUFQFQ23KS&client_secret=EFDTVXXZJSBEVC12RAMZBV24RFUDEY3E1CG2USRDT0NWEK1A

