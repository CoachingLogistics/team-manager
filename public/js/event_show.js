//must include the below on the page to make a google map?
//<script src="http://maps.googleapis.com/maps/api/js?key=AIzaSyA645rwcj_NE3CJnO83xX2CQ9ef7n4XWwI&sensor=true"></script>

$(document).bind("pageinit", function(){

	var event_id = $(location).attr('pathname').replace('/events/', '');

	$(".playah").each(function(index){
		var player_id = $(this).attr("id");
		console.log(player_id);

		
		//AJAX fetches the player's attendance for an event

		$.get('/events/'+event_id+'/players/'+player_id+'/attendance', function(doc, err){
			//console.log(doc[0]);
			console.log($('this'));

			if(doc[0].attending == true){
				$('#'+player_id+"-response").html("Attending").trigger('create');
			}else if(doc[0].attending == false){
				$('#'+player_id+"-response").html("Not attending").trigger('create');
			}else if(doc[0].attending == null){
				$('#'+player_id+"-response").html("No response").trigger('create');
				$($('.buttonPlacement')[index]).html("<a data-role='button' data-mini='true' data-inline='true' href='/attendanceRemind/" + event_id + "/" + player_id + "'>Email Reminder</a>");
			}else{
				console.log(player_id+ " has not been invited");
			}

		})
	})

/*
 * Goes through every player and determines if a guardian is logged on. If so it will add buttons
 * that will allow the logged in user to update attendances statuses on the website
 */
$(".playah").each(function(index) {
	var player_id = $(this).attr("id");
	$.get("/players/" + player_id + "/" + event_id + "/guardians", function(data) {
		// getting the data to easy to use params
		var guardians = data.guardians;
		var user_id = data.user_id;
		var attendance_id = data.attendance_id;
		// add the buttons if the user is a guardian and the attendance exists
		if(guardians.indexOf(user_id) != -1 && attendance_id) {
			$($('.guardianButtons')[index]).html("<a href='/attendanceUpdate/" + event_id + "/" + player_id + "/t' data-role='button' data-inline='inline' data-mini='true' data-icon='check' data-iconpos='notext'>Yes</a><a href='/attendanceUpdate/" + event_id + "/" + player_id + "/f' data-role='button' data-inline='inline' data-mini='true' data-icon='delete' data-iconpos='notext'>No</a>").trigger('create');
		}
	});
});

		//loading the google map
		$.get('/events/'+event_id+'/coordinates', function(coords, err){
			var lat=coords.latitude;
			var lon=coords.longitude;


			var mapProp = {
			  center:new google.maps.LatLng(lat,lon),
			  zoom:13,
			  mapTypeId:google.maps.MapTypeId.ROADMAP
			  };

			 //initializing the map object
			//  			var $mapCanvas = $("#map-canvas");
			// map = new google.maps.Map($mapCanvas.get(0), mapProp);

			// var listenerHandle = google.maps.event.addListener(map, 'idle', function() {
			//     $mapCanvas.appendTo($("#googleMap"));
			//     google.maps.event.removeListener(listenerHandle);
			// });
			var map = new google.maps.Map(document.getElementById("googleMap"),mapProp);


			var directionsDisplay = new google.maps.DirectionsRenderer();


			var event_marker=new google.maps.Marker({
			  position: new google.maps.LatLng(lat,lon),
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

			//attachInstructionText(event_marker, "Hi");//event_obj.name + "<br>" + event_obj.location);
			//$('#tabs').tabs();


		});





	//loading the carpool driver information
	$(".driver").each(function(index) {
		var user_id = $(this).attr("id");
		$.get("/users/" + user_id + "/info", function(user){

			if(user){
				$('#'+user_id).html("<a href='/users/" + user._id + "'>" + user.first_name + " " + user.last_name + "</a>").trigger('create');
			}else{
				$('#'+user_id).html("Error");
			}
		});
	});
	

		//loading the carpool rider information
	$(".driver-riders").each(function(index){
		var carpool_id = $(this).attr("id");
		$.get("/carpools/" + carpool_id + "/riders", function(riders){
			if(riders){

				var ryders = "";

				riders.forEach(function(rider){
					ryders+="<a href='/players/"+rider._id+"'>"+rider.first_name+" "+rider.last_name+"</a><br />"
				})

				$('#'+carpool_id).append(ryders).trigger('create');
			}else{
				$('#'+carpool_id).append("no riders");
			}
		});
	});

});

//google.maps.event.addDomListener(window, 'load', initialize);
//<div id="googleMap" style="width:500px;height:380px;"></div>
