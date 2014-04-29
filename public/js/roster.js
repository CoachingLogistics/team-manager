$(document).bind("pageinit", function(){

	var post_url = $(location).attr('pathname').replace('/roster-fill', '/roster-create');
	//should get "/teams/:id/roster-create"
	var red_url = $(location).attr('pathname').replace('/roster-fill', '');
	//should get "/teams/:id"
	var rows = 1;

	//this creates more rows of players
	$("#add_row1").click(function(){
		rows++;
		var input = "";

	    		input+= "<form class='form-inline row roster-form' id='roster_form"+rows+"' method='post' action='"+post_url+"' role='form' data-ajax='false'>"
				input+= "<div class='ui-grid-b'>"
				input+= "<div class='ui-block-a'><div class='ui-bar' style='height:60px'><input type='text' placeholder='First Name' name='first_name' data-inline='true'></div></div>"
				input+= "<div class='ui-block-b'><div class='ui-bar' style='height:60px'><input type='text' placeholder='Last Name' name='last_name' data-inline='true'></div></div>"
				input+= "<div class='ui-block-c'><div class='ui-bar' style='height:60px'><input type='email' placeholder='Email' name='email' data-inline='true'></div></div>"
				input+= "</div>"
				input+= "</form>"

		$("#roster-list1").append(input).trigger("create");
		$("#submit1").removeAttr("disabled");

	});

	
	//submits the individual forms, which are rows
	$("#submit1").click(function(){

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


