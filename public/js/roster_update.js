$(function(){

	var post_url = $(location).attr('pathname').replace('/roster', '/roster-create');
	var red_url = $(location).attr('pathname').replace('/roster', '');
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
		$("#submit").removeAttr("disabled");

	});



	$("#submit").click(function(){

		for(var ii = 1; ii <=rows; ii++){
			var dom_id = "#roster_form"+ii;

			console.log($(dom_id).find("input").last().val())

			if($(dom_id).find("input").last().val()){
				$.post($(dom_id).attr("action"), $(dom_id).serialize(), function () {
	            	console.log('Form '+ ii +' submitted');
	        	});
			}else{
				console.log("its empty");
			}
		}
		alert("Roster Submitted");
		$(location).attr('href',red_url).trigger("create");

	});




});