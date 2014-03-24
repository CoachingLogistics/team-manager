$(function(){

	var event_id = $(location).attr('pathname').replace('/events/', '');

	$(".playah").each(function(index){
		var player_id = $(this).attr("id");
		console.log(player_id);

		//right now I have the player_id and the event_id
		//I need the

		$.get('/events/'+event_id+'/players/'+player_id+'/attendance', function(doc, err){
			//console.log(doc[0]);
			console.log($('this'));

			if(doc[0].attending == true){
				$('#'+player_id).append("<span class='pull-right glyphicon glyphicon-ok'></span>").trigger('create');
			}else if(doc[0].attending == false){
				$('#'+player_id).append("<span class='pull-right glyphicon glyphicon-remove'></span>").trigger('create');
			}else if(doc[0].attending == null){
				$('#'+player_id).append("<span class='pull-right glyphicon glyphicon-minus'></span>").trigger('create');
				$($('.buttonPlacement')[index]).append("<a href='/attendanceRemind/" + event_id + "/" + player_id + "' class='btn btn-info btn-tiny glyphicon glyphicon-envelope'></a>");
			}else{
				console.log(player_id+ " has not been invited");
			}

		})
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


});

//google.maps.event.addDomListener(window, 'load', initialize);
//<div id="googleMap" style="width:500px;height:380px;"></div>
