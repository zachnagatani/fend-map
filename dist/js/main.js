function preLoad(){$(window).load(function(){$(".se-pre-con").fadeOut("slow")})}function googleMapsTimeout(){setTimeout(function(){var loaderWrapper=document.getElementById("loaderWrapper");"object"==typeof google&&"object"==typeof google.maps?(loaderWrapper.style.opacity="0",loaderWrapper.style.zIndex="0"):alert("This is taking longer than usual... reload the page. Homie.")},5e3)}function initApplication(){function styleInfoWindow(){google.maps.event.addListener(infoWindow,"domready",function(){var iwOuter=$(".gm-style-iw"),iwBackground=iwOuter.prev();iwBackground.children(":nth-child(2)").css({display:"none"}),iwBackground.children(":nth-child(4)").css({display:"none"}),iwBackground.children(":nth-child(3)").find("div").children().css({"box-shadow":"none","z-index":"1",background:"rgba(255, 255, 255, 1)"}),iwBackground.children(":nth-child(3)").find("div").children().css({"z-index":"1"});var iwCloseBtn=iwOuter.next();iwCloseBtn.next();iwCloseBtn.css({width:"25px",height:"25px",opacity:"1",right:"-75px",top:"6px",border:"1px solid #019CDE","border-radius":"13px","box-shadow":"0 0 5px #f0f0f0",background:"#fff"}),iwCloseBtn.children(":nth-child(1)").css({top:"-330px",left:"3px"}),iwCloseBtn.mouseout(function(){$(this).css({opacity:"1"})})})}var map,geocoder,userCity="",userCityGeocode={},allMarkers=[],infoWindow=new google.maps.InfoWindow({content:infoWindowNode});styleInfoWindow();var ViewModel={foursquareVenues:ko.observableArray([]),foursquareVenuesList:ko.observableArray([foursquareVenues]),markerList:ko.observableArray([allMarkers]),query:ko.observable(""),subscribeToSearch:function(){ViewModel.query.subscribe(ViewModel.search)},search:function(value){allMarkers.forEach(function(marker){marker.setMap(null)});for(var x in allMarkers)allMarkers[x].title.toLowerCase().indexOf(value.toLowerCase())>=0&&allMarkers[x].setMap(map);for(var listItemsList=document.getElementsByClassName("listItem"),i=0;i<listItemsList.length;i++)listItemsList[i].style.display="none";for(var i in listItemsList)(foursquareVenues[i].categories[0].name.toLowerCase().indexOf(value.toLowerCase())>=0||listItemsList[i].textContent.toLowerCase().indexOf(value.toLowerCase())>=0)&&(listItemsList[i].style.display="flex")},venueName:ko.observable(),listContainer:document.getElementById("listContainer"),openNavButton:document.getElementById("openNav"),closeNavButton:document.getElementById("closeNav"),searchSection:document.getElementById("searchSection"),openNav:function(){ViewModel.listContainer.style.zIndex="2",ViewModel.listContainer.style.opacity="1",ViewModel.openNavButton.style.display="none",ViewModel.closeNavButton.style.display="block",ViewModel.searchSection.style.zIndex="3",ViewModel.searchSection.style.opacity="1"},closeNav:function(){ViewModel.listContainer.style.zIndex="0",ViewModel.listContainer.style.opacity="0",ViewModel.searchSection.style.zIndex="0",ViewModel.searchSection.style.opacity="0",ViewModel.closeNavButton.style.display="none",ViewModel.openNavButton.style.display="block"},closeNavOnSelect:function(){var windowWidth=$(window).width();768>windowWidth&&ViewModel.closeNav()},venuePrice:ko.observable(),foursquareLocation:ko.observable(),googleDirections:ko.observable(),foursquareWebsite:ko.observable(),foursquareContact:ko.observable(),foursquareStatus:ko.observable(),foursquareRating:ko.observable(),infoWindowNode:document.getElementById("infoWindowNode"),infoWindowHeader:document.getElementById("infoWindowHeader"),openInfoWindow:function(index){function getFourSquare(){var venueID=ViewModel.foursquareVenues()[index].id,foursquareURL="https://api.foursquare.com/v2/venues/"+venueID+"?client_id=2DV1P3YPGYBLCEXLTRGNBKZR2EHZINKEHVET2TCUFQFQ23KS&client_secret=EFDTVXXZJSBEVC12RAMZBV24RFUDEY3E1CG2USRDT0NWEK1A&v=20170101&m=foursquare";$.ajax({dataType:"jsonp",url:foursquareURL}).done(function(data){if(console.log(data),"venue"in data.response){var venueInfo=data.response.venue;data.response.venue.photos.groups[0].items[0];ViewModel.venuePrice(venueInfo.attributes.groups[0].summary),ViewModel.foursquareLocation(venueInfo.location.address+" "+venueInfo.location.city+", "+venueInfo.location.state);var googleDirectionsURL="http://maps.google.com/maps?saddr="+userCity+"&daddr="+venueInfo.location.address+venueInfo.location.city+venueInfo.location.state;document.getElementById("googleDirections").setAttribute("href",googleDirectionsURL),document.getElementById("foursquareLink").setAttribute("href",venueInfo.url),ViewModel.foursquareContact(venueInfo.contact.formattedPhone),ViewModel.foursquareStatus(venueInfo.hours.status),void 0!==venueInfo.rating&&ViewModel.foursquareRating(venueInfo.rating),$("#foursquareRating").css({background:"#"+venueInfo.ratingColor})}else $("#infoWindowContentContainer").empty(),$("#infoWindowContentContainer").append("<h3 id='foursquareError'>Sorry! Foursquare data could not be found for this location.")}).fail(function(){$("#infoWindowContentContainer").empty(),$("#infoWindowContentContainer").append("<h3>Foursquare could not be reached at this time.</h3>")})}ViewModel.infoWindowNode.style.display="block",ViewModel.venueName(ViewModel.foursquareVenues()[index].name),infoWindow.open(map,allMarkers[index]),getFourSquare(),null!==allMarkers[index].getAnimation()?allMarkers[index].setAnimation(null):(allMarkers[index].setAnimation(google.maps.Animation.BOUNCE),setTimeout(function(){allMarkers[index].setAnimation(null)},750))},userAddress:ko.observable(),poo:function(){ViewModel.openInfoWindow()},alertMeBaby:function(){var poo="doo";alert(poo)},initMap:function(){geocoder=new google.maps.Geocoder;var mapCenter={lat:37.3036,lng:-121.8974};map=new google.maps.Map(document.getElementById("mapContainer"),{center:mapCenter,zoom:14,mapTypeControl:!1}),geocoder&&geocoder.geocode({address:userCity},function(results,status){status==google.maps.GeocoderStatus.OK&&status!==google.maps.GeocoderStatus.ZERO_RESULTS&&(map.setCenter(results[0].geometry.location),userCityGeocode=results[0].geometry.location)}),ViewModel.createMarkers(),google.maps.event.addDomListener(window,"resize",function(){map.setCenter(userCityGeocode)}),google.maps.event.addDomListener(window,"scroll",function(){})},createMarkers:function(){var infoWindowName=(document.getElementById("infoWindowNode"),document.getElementById("infoWindowHeader"),document.createElement("h1"));infoWindowName.id="infoWindowName";var listList=document.getElementsByClassName("listItem");listList.length;foursquareVenues.forEach(function(location){function createInfoWindow(){ViewModel.infoWindowNode.style.display="block",infoWindow.open(map,marker)}function getFourSquare(){ViewModel.venueName(marker.title);var venueID=location.id,foursquareURL="https://api.foursquare.com/v2/venues/"+venueID+"?client_id=2DV1P3YPGYBLCEXLTRGNBKZR2EHZINKEHVET2TCUFQFQ23KS&client_secret=EFDTVXXZJSBEVC12RAMZBV24RFUDEY3E1CG2USRDT0NWEK1A&v=20170101&m=foursquare";$.ajax({dataType:"jsonp",url:foursquareURL}).done(function(data){if(console.log(data),"venue"in data.response){var venueInfo=data.response.venue;data.response.venue.photos.groups[0].items[0];ViewModel.venuePrice(venueInfo.attributes.groups[0].summary),ViewModel.foursquareLocation(venueInfo.location.address+" "+venueInfo.location.city+", "+venueInfo.location.state);var googleDirectionsURL="http://maps.google.com/maps?saddr="+userCity+"&daddr="+venueInfo.location.address+venueInfo.location.city+venueInfo.location.state;document.getElementById("googleDirections").setAttribute("href",googleDirectionsURL),document.getElementById("foursquareLink").setAttribute("href",venueInfo.url),ViewModel.foursquareContact(venueInfo.contact.formattedPhone),ViewModel.foursquareStatus(venueInfo.hours.status),void 0!==venueInfo.rating&&ViewModel.foursquareRating(venueInfo.rating),$("#foursquareRating").css({background:"#"+venueInfo.ratingColor})}else $("#infoWindowContentContainer").empty(),$("#infoWindowContentContainer").append("<h3 id='foursquareError'>Sorry! Foursquare data could not be found for this location.")}).fail(function(){$("#foursquareLocation, #foursquareLink, #foursquareImg, #foursquareError, #foursquareRating, #foursquareRatingHeader, #foursquareStatus, #foursquareContact, #foursquarePrice").remove(),$("#infoWindowNode").append("<h3>Foursquare could not be reached at this time.</h3>")})}function toggleBounce(){null!==marker.getAnimation()?marker.setAnimation(null):(marker.setAnimation(google.maps.Animation.BOUNCE),setTimeout(function(){marker.setAnimation(null)},750))}location.coordinates={lat:location.location.lat,lng:location.location.lng};var marker=new google.maps.Marker({position:location.coordinates,map:map,title:location.name,animation:google.maps.Animation.DROP});allMarkers.push(marker),marker.addListener("click",function(){createInfoWindow(),getFourSquare(),toggleBounce()})})},introSearch:function(){function getFoursquareVenues(){var foursquareVenuesURL="https://api.foursquare.com/v2/venues/explore?near="+introSearchInput.value+"&section=food&limit=50&client_id=2DV1P3YPGYBLCEXLTRGNBKZR2EHZINKEHVET2TCUFQFQ23KS&client_secret=EFDTVXXZJSBEVC12RAMZBV24RFUDEY3E1CG2USRDT0NWEK1A&v=20170101&m=foursquare";$.ajax({dataType:"jsonp",url:foursquareVenuesURL}).done(function(data){if(console.log(data),data.response.groups){var foursquareVenueResponseArray=data.response.groups[0].items;foursquareVenueResponseArray.forEach(function(venue){foursquareVenues.push(venue.venue)}),ViewModel.initMap();var closeSearch=function(){var introSearchContainer=document.getElementById("introSearchContainer");introSearchContainer.style.opacity="0";setTimeout(function(){introSearchContainer.style.display="none"},1e3)};closeSearch(),function(){foursquareVenues.forEach(function(venue){ViewModel.foursquareVenues.push(venue)}),console.log(ViewModel.foursquareVenues())}(),ViewModel.userAddress(userCity)}else alert("Error! Please enter a properly formatted address or city.")}).fail(function(){alert("Sorry; the Foursquare servers could not be reached.")})}var introSearchInput=document.getElementById("introSearchInput");userCity=introSearchInput.value,getFoursquareVenues()}};ko.applyBindings(ViewModel),ViewModel.subscribeToSearch()}preLoad();