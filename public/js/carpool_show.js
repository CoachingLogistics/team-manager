//must include the below on the page to make a google map?
//<script src="http://maps.googleapis.com/maps/api/js?key=AIzaSyA645rwcj_NE3CJnO83xX2CQ9ef7n4XWwI&sensor=true"></script>

$(function(){
	$('#carpool-directions').hide();

	var carpool_id = $(location).attr('pathname').replace('/carpools/', '');



		$.get('/carpools/'+carpool_id+'/routing', function(doc, err){

			var event = doc.event;
			var carpool = doc.carpool;
			var riders = doc.riders;

			var mapProp = {
			  center:new google.maps.LatLng(event.latitude, event.longitude),
			  zoom:13,
			  mapTypeId:google.maps.MapTypeId.ROADMAP
			  };

			 //initializing the map object
			var map = new google.maps.Map(document.getElementById("googleMap"),mapProp);

			var directionsService = new google.maps.DirectionsService();
			var directionsDisplay = new google.maps.DirectionsRenderer();
			directionsDisplay.setMap(map);


			var event_marker=new google.maps.Marker({
			  position: new google.maps.LatLng(event.latitude, event.longitude),
			  map: map,
			  title: "EVENT"
			  //icon:'/images/someting.png'
			  });

			var stepDisplay = new google.maps.InfoWindow();
			function attachInstructionText(marker, text) {
			  google.maps.event.addListener(marker, 'click', function() {
			    // Open an info window when the marker is clicked on,
			    // containing the text of the step.
			    stepDisplay.setContent(text);
			    stepDisplay.open(map, marker);
			  });
			}

			// attachInstructionText(event_marker, event.type + "<br>" + event.location);


			var waypoints = [];
			riders.forEach(function(rider){
				waypoints.push({
					location: rider.location,
					stopover: true
				})
			});

			var google_request = {
				origin: carpool.location,
			    destination: event.location,
			    waypoints: waypoints,
			    optimizeWaypoints: true,
			    travelMode: google.maps.TravelMode.DRIVING
			}

			var directionsService = new google.maps.DirectionsService();



			directionsService.route(google_request, function(response, status) {
			    if (status == google.maps.DirectionsStatus.OK) {
			      directionsDisplay.setDirections(response);
			      var legs = response.routes[0].legs;

			      console.log(legs)

			      legs.forEach(function(leg){
			      	var steps = leg.steps;

			      	steps.forEach(function(step){

			      		var html = "<tr><td>"+step.instructions+"</td></tr>";
			      		$("#directions").append(html).trigger("create");
			      		console.log(step.instructions)
			      	})

			      })
			    }
			});



		})

	//do AJAX call to get loaction, or get location from page
	//then need to get the coordinates

	//need to get coordinates of location
	// var address = $("#location").html().replace("<b>Location: </b>", "").replace("<br>", "");
	// console.log(address);
	// var gmapAPI = "http://maps.googleapis.com/maps/api/geocode/json?";
	// var jsonReq = {
	// 	address: address,
	// 	sensor: false,
	// 	key: ,
	// }
	// $.get(gmapAPI+jsonReq)


			// var lat=coords.lat;
			// var lon=coords.lng;

			// var mapProp = {
			//   center:new google.maps.LatLng(lat,lon),
			//   zoom:10,
			//   mapTypeId:google.maps.MapTypeId.ROADMAP
			//   };

			//  //initializing the map object
			// var map = new google.maps.Map(document.getElementById("googleMap")//jquery here?
			//   ,mapProp);


			// var directionsDisplay = new google.maps.DirectionsRenderer();


			// var event_marker=new google.maps.Marker({
			//   position: new google.maps.LatLng(lat,lon),
			//   map: map,
			//   title: event_obj.name
			//   //icon:'/images/someting.png'
			//   });

			// var stepDisplay = new google.maps.InfoWindow();
			// function attachInstructionText(marker, text) {
			//   google.maps.event.addListener(marker, 'click', function() {
			//     // Open an info window when the marker is clicked on,
			//     // containing the text of the step.
			//     stepDisplay.setContent(text);
			//     stepDisplay.open(map, marker);
			//   });
			// }

			$('#direction-button').click(function() {
				if(!$('#carpool-directions').is(':visible')) {
					$('#carpool-directions').show();
					$('#direction-button').text('Hide Directions');
				}
				else {
					$("#carpool-directions").hide();
					$('#direction-button').text('Show Directions');
				}
			});

});

//google.maps.event.addDomListener(window, 'load', initialize);
//<div id="googleMap" style="width:500px;height:380px;"></div>
