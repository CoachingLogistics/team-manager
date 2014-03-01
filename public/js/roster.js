$(function(){

	var post_url = $(location).attr('pathname').replace('/roster-fill', '/roster-create');
	var rows = 1;

	//this creates more rows of players
	$("#add_row").click(function(){
		rows++;
		var input = "";
	    			input+= " <form class='form-inline row roster-form' id='roster_form"+rows+"' method='post' action='"+post_url+"' role='form'> ";
					input+= " <div class='form-group roster-spot'> ";
					input+= " <div class='full-width'> ";
					input+= " <input type='text' class='form-control' placeholder='First Name' name='player_fn"+rows+"' style='width:100%'> ";
					input+= " </div> ";
					input+= " </div> ";
					input+= " <div class='form-group roster-spot'> ";
					input+= " <div class='full-width'> ";
					input+= " <input type='text' class='form-control' placeholder='Last Name' name='player_ln"+rows+"' style='width:100%'> ";
					input+= " </div> ";
					input+= " </div> ";
					input+= " <div class='form-group roster-spot'> ";
					input+= " <div class='full-width'> ";
					input+= " <input type='email' class='form-control' placeholder='Email' name='player_email"+rows+"' style='width:100%'> ";
					input+= " </div> ";
					input+= " </div> ";
					input+= " </form> ";

		$("#roster-list").append(input).trigger("create");

	});



	$("#submit").click(function(){
		alert("hey");
	});








});


