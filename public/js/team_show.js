$(document).bind("pageinit", function(){

	var team_id = $(location).attr('pathname').replace('/teams/', '');

	$(".ajax-attendance").each(function(index){
		var player_id = $(this).attr("id");
		console.log(player_id);

		
		//AJAX fetches the player's attendance for an event

		$.get('/teams/'+team_id+'/next_event', function(ev, err){

			console.log(ev.date);
			var date = new Date(ev.date);
			console.log(date);
			if(ev){
				$("#event-name").html("<a href='/events/"+ev._id+"'>"+ev.type+"  "+dateFormat(date)+"</a>").trigger('create');
				
				$.get('/events/'+ev._id+'/players/'+player_id+'/attendance', function(doc, err){

					if(doc[0].attending == true){
						$('#'+player_id).html("Attending").trigger('create');
					}else if(doc[0].attending == false){
						$('#'+player_id).html("Not attending").trigger('create');
					}else if(doc[0].attending == null){
						$('#'+player_id).html("No response").trigger('create');
						$($('.buttonPlacement')[index]).append("<a href='/attendanceRemind/" + ev._id + "/" + player_id + "' class='btn btn-info btn-tiny glyphicon glyphicon-envelope'></a>");
					}else{
						console.log(player_id+ " has not been invited");
					}

				})

			} else {
				$("#event-name").html("No upcoming events").trigger('create');
			}

		})
	})

/*
 * Goes through every player and determines if a guardian is logged on. If so it will add buttons
 * that will allow the logged in user to update attendances statuses on the website
 */
// $(".playah").each(function(index) {
// 	var player_id = $(this).attr("id");
// 	$.get("/players/" + player_id + "/" + event_id + "/guardians", function(data) {
// 		// getting the data to easy to use params
// 		var guardians = data.guardians;
// 		var user_id = data.user_id;
// 		var attendance_id = data.attendance_id;
// 		// add the buttons if the user is a guardian and the attendance exists
// 		if(guardians.indexOf(user_id) != -1 && attendance_id) {
// 			$($('.guardianButtons')[index]).append("<a href='/attendanceUpdate/" + event_id + "/" + player_id + "/t' class='btn btn-tiny btn-success glyphicon glyphicon-ok'></a><a href='/attendanceUpdate/" + event_id + "/" + player_id + "/f' class='btn btn-danger btn-tiny glyphicon glyphicon-remove'></a>");
// 		}
// 	});
// });

var dateFormat = function(date) {
    var day = date.getDate();
    var month = date.getMonth()+1;
    var year = date.getFullYear();
    return month+"/"+day+"/"+year;
};

});