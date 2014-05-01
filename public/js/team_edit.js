$(document).bind("pageinit", function(){

	var team_id = $(location).attr('pathname').replace('/teams/', '').replace('/edit', '');

	$(".remove-man").on('click', function(index){
		var user_id = $(this).attr("id");

			var action = '/teams/'+team_id+'/user/'+user_id+'/remove'
		    var form = document.createElement('form');
		    form.setAttribute('method', 'post');
		    form.setAttribute('action', '/teams/'+team_id+'/user/'+user_id+'/remove');
		    form.style.display = 'hidden';
		    $.post(action, function(){
		    	//nothing
		    });
	});

});