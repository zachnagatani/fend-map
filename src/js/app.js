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

		yelpBusinessID: 'pizza-my-heart-san-jose',

		type: "Food",

		coordinates: {

			lat: 37.303856,

			lng: -121.89722,
		}
	},

	{
		name: "Powell's Sweet Shoppe",

		type: "Food",

		coordinates: {

			lat: 37.307686,

			lng: -121.900156,
		}
	},

	{
		name: "Hicklebee's Bookstore",

		type: "Art",

		coordinates: {

			lat: 37.304035,

			lng: -121.897363,
		}
	},

	{
		name: "AZ Fine Art Gallery",

		type: "Art",

		coordinates: {

			lat: 37.306385,

			lng: -121.899933,
		}
	},

	{
		name: "MainStreet Burgers",

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

	// for (var i = 0; i < listListLength; i++) {

	// 	var marker = new google.maps.Marker({
	// 	    position: locationData[i].coordinates,
	// 	    map: map,
	// 	    title: locationData[i].name
	// 	});

	// 	allMarkers.push(marker);

	// 	infoWindowName.textContent = locationData[i].name;

	// 	function createInfoWindow(){

	// 		infoWindowNode.appendChild(infoWindowName);

	// 		var infoWindow = new google.maps.InfoWindow({
	// 	    	content: infoWindowNode
	// 		});

	// 		infoWindow.open(map, marker);

	// 	};

	// 	listList[i].addEventListener('click', (function(infoWindowNameCopy){

	// 		return function(){
	// 			console.log(infoWindowNameCopy);
	// 			createInfoWindow();
	// 		}


	// 	})(infoWindowName.textContent));

	// };

	// Array.prototype.forEach.call(listList, function(listItem){

	// 	locationData.forEach(function(location){

	// 		var marker = new google.maps.Marker({
	// 		    position: location.coordinates,
	// 		    map: map,
	// 		    title: location.name
	// 		});

	// 		allMarkers.push(marker);

	// 		infoWindowName.textContent = location.name;

	// 		function createInfoWindow(){

	// 		infoWindowNode.appendChild(infoWindowName);

	// 		var infoWindow = new google.maps.InfoWindow({
	// 	    	content: infoWindowNode
	// 		});

	// 		infoWindow.open(map, marker);

	// 	};

	// 		listItem.addEventListener('click', function(){

	// 			createInfoWindow();
	// 			// console.log(infoWindowName.textContent);

	// 		});

	// 	});

	// 	// for (var i = 0; i < locationData.length; i++){

	// 	// 	var marker = new google.maps.Marker({
	// 	// 	    position: locationData[i].coordinates,
	// 	// 	    map: map,
	// 	// 	    title: locationData[i].name
	// 	// 	});

	// 	// }


	// 	// allMarkers.push(marker);

	// 	// locationData.forEach(function(location){
	// 	// 	infoWindowName.textContent = location.name;
	// 	// });

	// 	infoWindowName.textContent = listItem.textContent;

	// 	function createInfoWindow(){

	// 		infoWindowNode.appendChild(infoWindowName);

	// 		var infoWindow = new google.maps.InfoWindow({
	// 	    	content: infoWindowNode
	// 		});

	// 		infoWindow.open(map, marker);

	// 	};

	// 	listItem.addEventListener('click', function(){

	// 		createInfoWindow();
	// 		// console.log(infoWindowName.textContent);

	// 	});

	// });

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

		// Array.prototype.forEach.call(listList, function(listItem){
		// 	listItem.addEventListener('click', function(){
		// 		createInfoWindow();
		// 		console.log(listItem);
		// 	});
		// });

		// listList[0].addEventListener('click', function(){
		// 		createInfoWindow();
		// 		console.log(listList[0]);
		// });

		// for (var i = 0; i < listList.length; i++) {

		// 		var currentItem = listList[i];

		// 		currentItem.addEventListener('click', function(){
		// 			createInfoWindow();
		// 			console.log(currentItem);
		// 		});
		// };

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

	// this.filters = ko.observableArray(filters);
	// this.filter = ko.observable('');
	// this.filteredItems = ko.computed(function(){
	// 	var filter = self.filter();
	// 		if (filter != "No Filter") {
	// 			console.log(self.locationList());
	// 		} else {
	// 		    return ko.utils.arrayFilter(self.locationList(), function(i) {
	// 		        return i.type === filter;
	// 		    });
	// 	}
 //    });

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

		$.ajax({
			dataType: "jsonp",
			url: wikiURL
		}).done(function(data){
			console.log(data);

			var wikiObject = data.query.pages[Object.keys(data.query.pages)[0]];
			var wikiTitle = wikiObject.title;
			$('#wikiTitle').remove();
			$('#infoWindowNode').append("<h3 id='wikiTitle'>Read All About: <a target=_blank href='https://en.wikipedia.org/wiki/" + wikiTitle + "'>" + wikiTitle + "</a>!</h3>");
		});

	};

};

ko.applyBindings(new ViewModel());