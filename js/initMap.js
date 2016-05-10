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

	var infoWindowName = document.createElement('h1');
	infoWindowName.id = "infoWindowName";
	var infoWindowNode = document.getElementById('infoWindowNode');
	var listList = document.getElementsByClassName('listItem');

	var listListLength = listList.length;

	locationData.forEach(function(location){

		var marker = new google.maps.Marker({
		    position: location.coordinates,
		    map: map,
		    title: location.name,
		    animation: null
	});

		allMarkers.push(marker);

		var IF = function(){
			this.textContent = location.name;
			var infoWindow = new google.maps.InfoWindow
		};

		function createInfoWindow(){
			$("#infoWindowName").remove();
			infoWindowName.textContent = location.name;
			infoWindowNode.appendChild(infoWindowName);

			// var infoWindow = new google.maps.InfoWindow({
		 //    	content: infoWindowNode
			// });

			infoWindow.open(map, marker);
		};

		function getWiki(){
			// WikiPedia API
			var wikiURL = "https://en.wikipedia.org/w/api.php?action=query&titles=" + location.name + "&prop=revisions&rvprop=content&format=json";


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
		};

		function getFourSquare(){
			// Foursquare api
			var venueID = location.foursquareVenueID;

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
				$('#foursquareLocation, #foursquareLink, #foursquareImg, #foursquareError').remove();
				$("#infoWindowNode").append("<h3>Foursquare could not be reached at this time.</h3>");
			});

			getWiki();

		};

		// https://developers.google.com/maps/documentation/javascript/markers#animate
		function toggleBounce() {
			if (marker.getAnimation() !== null) {
				marker.setAnimation(null);
			} else {
				marker.setAnimation(google.maps.Animation.BOUNCE);
				// http://stackoverflow.com/questions/7339200/bounce-a-pin-in-google-maps-once
				setTimeout(function(){ marker.setAnimation(null); }, 750)
			}
		}

		// TODO: Make open infoWindow close on click of another marker
		marker.addListener('click', function(){
			createInfoWindow();
			getFourSquare();
			toggleBounce();
		});

	});

}