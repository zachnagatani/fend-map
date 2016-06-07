function initApplication() {
	var map;
	var	geocoder;
		userCity = '';
		userCityGeocode = {};
		allMarkers = [];
		infoWindow = new google.maps.InfoWindow({
		content: infoWindowNode
	});

	function styleInfoWindow() {
		google.maps.event.addListener(infoWindow, 'domready', function() {
			var iwOuter = $('.gm-style-iw');

			/* The DIV we want to change is above the .gm-style-iw DIV.
			 * So, we use jQuery and create a iwBackground variable,
			 * and took advantage of the existing reference to .gm-style-iw for the previous DIV with .prev().
			 */
			var iwBackground = iwOuter.prev();

			iwBackground.children(':nth-child(2)').css({
				'display': 'none'
			});

			iwBackground.children(':nth-child(4)').css({
				'display': 'none'
			});

			iwBackground.children(':nth-child(1)').css({
				'position': 'relative',
				'z-index': '0'
			});

			iwBackground.children(':nth-child(3)').find('div').children().css({
				'box-shadow': 'none',
				'z-index': '-1',
				'background': 'rgba(255, 255, 255, 1)',
				'position': 'relative',
				'z-index': '0'
			});

			iwBackground.children(':nth-child(3)').find('div').children().css({
				'z-index': '1'
			});

			var iwCloseBtn = iwOuter.next();

			var iwCloseBtnX = iwCloseBtn.next();

			iwCloseBtn.css({
				width: "25px",
				height: "25px",
				opacity: '1', // by default the close button has an opacity of 0.7
				right: '25px',
				top: '6px', // button repositioning
				border: '1px solid #019CDE', // increasing button border and new color
				'border-radius': '13px', // circular effect
				'box-shadow': '0 0 5px #f0f0f0', // 3D effect to highlight the button
				background: '#fff'
			});

			iwCloseBtn.children(':nth-child(1)').css({
				top: '-330px',
				left: '3px'
			});

			iwCloseBtn.mouseout(function() {
				$(this).css({
					opacity: '1'
				});
			});
		});
	}

	styleInfoWindow();
	initViewModel();
} //initApplication Closing Brace