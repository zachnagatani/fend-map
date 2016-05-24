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

/*

TODO:
	-1. Responsiveness
	-2. Make filter "error free." The only error is if a venue doesn't have a categories property
	-3. Proper use of KO. Don't update the DOM manually
	-4. All API's are retrieved ASYNC
	-5. Error handling for google maps
6. Finalize design for infoWindows
7. README
8. Comments

*/
var infoWindow = new google.maps.InfoWindow({
		    	content: infoWindowNode
});
google.maps.event.addListener(infoWindow, 'domready', function() {
   var iwOuter = $('.gm-style-iw');

   /* The DIV we want to change is above the .gm-style-iw DIV.
    * So, we use jQuery and create a iwBackground variable,
    * and took advantage of the existing reference to .gm-style-iw for the previous DIV with .prev().
    */
   var iwBackground = iwOuter.prev();
   iwBackground.children(':nth-child(2)').css({'display' : 'none'});
   iwBackground.children(':nth-child(4)').css({'display' : 'none'});

   iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': 'rgba(1,156,222,.75) 0px 1px 6px', 'z-index' : '1'});

   iwBackground.children(':nth-child(3)').find('div').children().css({'z-index' : '1'});
	var iwCloseBtn = iwOuter.next();

	var iwCloseBtnX = iwCloseBtn.next();
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
	iwCloseBtn.children(':nth-child(1)').css({
		top: '-330px',
		left: '3px'
	});
	iwCloseBtn.mouseout(function(){
	  $(this).css({opacity: '1'});
	});


});
var ViewModel = function() {
	var self = this;
	this.locationList = ko.observableArray(this.locations);

	this.foursquareVenues = ko.observableArray([]);
	this.locationData = ko.observableArray(locationData);

	this.foursquareVenuesList = ko.observableArray([foursquareVenues]);
	this.markerList = ko.observableArray([allMarkers]);
	this.query = ko.observable('');

	this.userAddress = ko.observable();
	this.search = function(value){
		allMarkers.forEach(function(marker) {

			marker.setMap(null);

		});
		for(var x in allMarkers) {

			if(allMarkers[x].title.toLowerCase().indexOf(value.toLowerCase()) >= 0) {

				allMarkers[x].setMap(map);

			}

		}
		var listItemsList = document.getElementsByClassName('listItem');
		for (var i = 0; i < listItemsList.length; i++) {

			listItemsList[i].style.display = "none";

		}
		for(var i in listItemsList) {


			if(foursquareVenues[i].categories[0].name.toLowerCase().indexOf(value.toLowerCase()) >= 0 || listItemsList[i].textContent.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
				listItemsList[i].style.display = "flex";

			}

		}

	};
	this.query.subscribe(self.search);

	this.infoWindowName = document.createElement('h1');
	this.infoWindowName.id = "infoWindowName";
	this.infoWindowNode = document.getElementById('infoWindowNode');
	this.infoWindowHeader = document.getElementById('infoWindowHeader');
	this.venueName = ko.observable();
	this.openNav = function(){
		document.getElementById('listContainer').style = "left: 0";
		document.getElementById('mapContainer').style = "transition: 1s; left: 135px";

	};
	this.closeNav = function(){
		document.getElementById('listContainer').style = "left: -230px";
		document.getElementById('mapContainer').style = "transition: .25s; left: 0px";

	};

	this.closeNavOnSelect = function(){
		if ($(window).width() < 768) {
		   self.closeNav();
		};

	};

	this.venuePrice = ko.observable();
	this.foursquareLocation = ko.observable();
	this.foursquareWebsite = ko.observable();
	this.foursquareContact = ko.observable();
	this.foursquareStatus = ko.observable();
	this.foursquareRating = ko.observable();
	this.foursquareLink = document.getElementById('foursquareLink');
	this.openInfoWindow = function(index){

		self.infoWindowNode.style.display = "block";
		var listItemIndex = index;
		self.venueName(foursquareVenues[listItemIndex].name);
		infoWindow.open(map, allMarkers[listItemIndex]);
		function getFourSquare(){
			var venueID = foursquareVenues[index].id;
			var foursquareURL = "https://api.foursquare.com/v2/venues/" + venueID + "?client_id=2DV1P3YPGYBLCEXLTRGNBKZR2EHZINKEHVET2TCUFQFQ23KS&client_secret=EFDTVXXZJSBEVC12RAMZBV24RFUDEY3E1CG2USRDT0NWEK1A&v=20170101&m=foursquare";
			$.ajax({
				dataType: "jsonp",
				url: foursquareURL
			}).done(function(data){
				console.log(data);
				if(!("venue" in data.response)) {
					$('#infoWindowContentContainer').empty();
					$('#infoWindowContentContainer').append("<h3 id='foursquareError'>Sorry! Foursquare data could not be found for this location.");

				} else {
					var venueInfo = data.response.venue;
					var photoGrab = data.response.venue.photos.groups[0].items[0];

					if(photoGrab){

						self.infoWindowNode.style.background = "url('" + photoGrab.prefix + photoGrab.width + "x" + photoGrab.height + photoGrab.suffix + "') no-repeat fixed center";

					} else {

						self.infoWindowNode.style.background = "#fff";
					}


					if(venueInfo.attributes.groups[0].summary) {

						self.venuePrice(venueInfo.attributes.groups[0].summary);

					} else {

						self.venuePrice(null);

					}

					if(venueInfo.location.address && venueInfo.location.city && venueInfo.location.state) {

						self.foursquareLocation(venueInfo.location.address + " " + venueInfo.location.city + ", " + venueInfo.location.state);

					} else {

						self.foursquareLocation(null);

					}

					if(venueInfo.url) {

						self.foursquareLink.href = venueInfo.url;

					} else {

						self.foursquareLink.href = '#';

					}

					if(venueInfo.contact.formattedPhone) {

						self.foursquareContact(venueInfo.contact.formattedPhone);

					} else {

						self.foursquareContact(null);

					}

					if(venueInfo.hours) {

						self.foursquareStatus(venueInfo.hours.status);

					} else {

						self.foursquareStatus(null);

					}

					if(venueInfo.rating != undefined) {
						self.foursquareRating(venueInfo.rating);
					}

					$('#foursquareRating').css({
						background: '#' + venueInfo.ratingColor
					});

				}
			}).fail(function(){
				$('#infoWindowContentContainer').empty();
				$("#infoWindowContentContainer").append("<h3>Foursquare could not be reached at this time.</h3>");

			});

		};
		getFourSquare();
		if (allMarkers[listItemIndex].getAnimation() !== null) {

				allMarkers[listItemIndex].setAnimation(null);

			} else {

				allMarkers[listItemIndex].setAnimation(google.maps.Animation.BOUNCE);
				setTimeout(function(){ allMarkers[listItemIndex].setAnimation(null); }, 750);

		}

	};

	this.introSearch = function() {

		var introSearchInput = document.getElementById('introSearchInput');
		userCity = introSearchInput.value;

		function getFoursquareVenues(){

			var foursquareVenuesURL = "https://api.foursquare.com/v2/venues/explore?near=" + introSearchInput.value + "&section=food&limit=50&client_id=2DV1P3YPGYBLCEXLTRGNBKZR2EHZINKEHVET2TCUFQFQ23KS&client_secret=EFDTVXXZJSBEVC12RAMZBV24RFUDEY3E1CG2USRDT0NWEK1A&v=20170101&m=foursquare";

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

				var typeSearchLabel = document.getElementById('typeSearchLabel')
				self.userAddress(userCity);

			});

		};

		function closeSearch() {

			var introSearchContainer = document.getElementById('introSearchContainer');
			introSearchContainer.style.opacity = "0";
			var displayTimeout = setTimeout(function(){

				introSearchContainer.style.display = "none";

			}, 1000);

		}

		getFoursquareVenues();

	};

};

ko.applyBindings(new ViewModel());
