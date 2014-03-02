$(function(){

	var post_url = $(location).attr('pathname').replace('/roster-fill', '/roster-create');
	var red_url = $(location).attr('pathname').replace('/roster-fill', '');
	var rows = 1;

	//this creates more rows of players
	$("#add_row").click(function(){
		rows++;
		var input = "";
	    			input+= " <form class='form-inline row roster-form' id='roster_form"+rows+"' method='post' action='"+post_url+"' role='form'> ";
					input+= " <div class='form-group roster-spot'> ";
					input+= " <div class='full-width'> ";
					input+= " <input type='text' class='form-control' placeholder='First Name' name='first_name' style='width:100%'> ";
					input+= " </div> ";
					input+= " </div> ";
					input+= " <div class='form-group roster-spot'> ";
					input+= " <div class='full-width'> ";
					input+= " <input type='text' class='form-control' placeholder='Last Name' name='last_name' style='width:100%'> ";
					input+= " </div> ";
					input+= " </div> ";
					input+= " <div class='form-group roster-spot'> ";
					input+= " <div class='full-width'> ";
					input+= " <input type='email' class='form-control' placeholder='Email' name='email' style='width:100%'> ";
					input+= " </div> ";
					input+= " </div> ";
					input+= " </form> ";

		$("#roster-list").append(input).trigger("create");

	});



	$("#submit").click(function(){
		alert("here it goes");

		for(var ii = 1; ii <=rows; ii++){
			console.log("hi");
			var dom_id = "#roster_form"+ii;

			$.post($(dom_id).attr("action"), $(dom_id).serialize(), function () {
            	console.log('Form '+ ii +' submitted');
        	});

			// $(dom_id).submit(function(){
			// 	//event.preventDefault();
			// });
		}
		$(location).attr('href',red_url).trigger("create");


	});




});


