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
var map;

function initMap(){

	// Location for map to be centered on
	// Snippet taken from: https://gist.github.com/magnificode/6113759
	var mapCenter = {lat: 37.3036, lng: -121.8974};

	map = new google.maps.Map(document.getElementById('mapContainer'), {
		center: mapCenter,
		zoom: 15
	});

	google.maps.event.addDomListener(window, 'resize', function() {
    	map.setCenter(mapCenter);
	});
};