$(function(){

	//this generates teams for each player
	$(".teams").children().each(function(){

	var id = $(this).attr("id");

		
		var url = "/players/"+id+"/teams";

		$.get(url, function(teams, err){

			var input = "<ul>";
			teams.forEach(function(t){
				input+= "<li><a href='/teams/"+t._id+"'>"+t.name+"</a></li>";
			})
			input+="</ul>";

			var div = "#"+id;

			$(div).html(input).trigger("create");

		})



	});




});