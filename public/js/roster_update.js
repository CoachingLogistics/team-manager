$(document).bind("pageinit", function(){

	var post_url = $(location).attr('pathname').replace('/roster', '/roster-create');
	//should get "/teams/:id/roster-create"
	var red_url = $(location).attr('pathname').replace('/roster', '');
	//should get "/teams/:id"
	var rows = 1;

	//this creates more rows of players
	$("#add_row2").click(function(){
		rows++;
		var input = "";

	    		input+= "<form class='form-inline row roster-form' id='roster_form"+rows+"' method='post' action='"+post_url+"' role='form' data-ajax='false'>"
				input+= "<label for='first_name'>First Name</label><input type='text' placeholder='First Name' name='first_name' data-inline='true'></div></div><br>"
				input+= "<label for='last_name'>Last Name</label><input type='text' placeholder='Last Name' name='last_name' data-inline='true'></div></div><br>"
				input+= "<label for='email'>Parent Email</label><input type='email' placeholder='Email' name='email' data-inline='true'></div></div><br>"
				input+= "</form>"
				input+= "<hr />"

		$("#roster-list2").append(input).trigger("create");
		$("#submit2").removeAttr("disabled");

	});


	//submits each row, which is a form
	$("#submit2").click(function(){

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