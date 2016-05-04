/* TODO:
1. Add full-screen map to the page. Check out resume tool and
cross worship center.
2. Add markers. Check out resume project (I added markers there before)
3. Create a list with those markers' locations. Check out cat-clicker
4. Filter option.. figure that out
5. Use others API's to provide info for the markers. Check ajax moving helper project (wikipedia/nytimes info)
6. Animations. Find animation libraries to handle this?
7. Error handling. Check out the ajax moving helper project again for .fail() with jquery ajax/getJSON
*/

var locationData = [

	{
		name: "Pizza My Heart",

		yelpBusinessID: 'pizza-my-heart-san-jose',

		coordinates: {

			lat: 37.303856,

			lng: -121.89722,
		}
	},

	{
		name: "Powell's Sweet Shoppe",

		coordinates: {

			lat: 37.307686,

			lng: -121.900156,
		}
	},

	{
		name: "Hicklebee's Bookstore",

		coordinates: {

			lat: 37.304035,

			lng: -121.897363,
		}
	},

	{
		name: "AZ Fine Art Gallery",

		coordinates: {

			lat: 37.306385,

			lng: -121.899933,
		}
	},

	{
		name: "MainStreet Burgers",

		coordinates: {

			lat: 37.308185,

			lng: -121.900533,
		}
	}

];

var map;

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

	var allMarkers = [];

	var length = locationData.length;

	var infoWindowName = document.getElementById('infoWindowName');
	var infoWindowNode = document.getElementById('infoWindowNode');
	// var listList = document.getElementsByClassName('listItem');
	// USE GET ELEMENTS BY ID NOT CLASS NAME! OR LOOP OVER THE ARRAY to add event listeners!!

	// var locationIteration = function(){

	// };

	locationData.forEach(function(location){

		var marker = new google.maps.Marker({
		    position: location.coordinates,
		    map: map,
		    title: location.name
		});

		allMarkers.push(marker);

		var infoWindow = new google.maps.InfoWindow({
		    content: infoWindowNode
		});

		function createInfoWindow(){
			infoWindowName.textContent = location.name;
			infoWindowNode.appendChild(infoWindowName);

			var infoWindow = new google.maps.InfoWindow({
		    	content: infoWindowNode
			});

			infoWindow.open(map, marker);
		};

		// TODO: Make open infoWindow close on click of another marker
		marker.addListener('click', function(){
			createInfoWindow();
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

	this.testMe = function(){

		console.log("SUCCESS");

	};

	this.openNav = function(){

		document.getElementById('listContainer').style = "left: 0";
		document.getElementById('mapContainer').style = "transition: 1s; left: 150px";

	};

	this.closeNav = function(){

		document.getElementById('listContainer').style = "left: -230px";
		document.getElementById('mapContainer').style = "transition: .25s; left: 0px";

	};

};


ko.applyBindings(new ViewModel());