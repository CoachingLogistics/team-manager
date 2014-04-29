$(document).bind("pageinit", function(){

	var team_id = $(location).attr('pathname').replace('/teams/', '');

	$(".ajax-attendance").each(function(index){
		var player_id = $(this).attr("id");


		
		//AJAX fetches the player's attendance for an event

		$.get('/teams/'+team_id+'/next_event', function(ev, err){


			var date = new Date(ev.date);

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

	$.get('/teams/'+team_id+'/calendar_events/', function(events, err){
		console.log(events);
		$('#calendar').fullCalendar({
	    	header:{left:   'title', center: 'month basicWeek', right:  'today prev,next'},
	    	weekMode: 'liquid',
	    	events: events,
	    	eventTextColor: "#000000",
	        contentHeight:200});
	});

	
	$('#tabs').tabs({
    activate: function(event, ui) {
        $('#calendar').fullCalendar('render');
    }
});


});

var dateFormat = function(date) {
    var day = date.getDate();
    var month = date.getMonth()+1;
    var year = date.getFullYear();
    return month+"/"+day+"/"+year;
};

