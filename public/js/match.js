$(document).bind("pageinit", function(){



//need one for password
$("#password, #password_confirm").keyup(function(){

var password = $("#password").val();
var	password_confirm = $("#password_confirm").val();

if( !password || !password_confirm){
	$(".pw_alert").empty();
	$(".password").css("background-color", "");

} else if (password != password_confirm){
		$(".pw_alert").empty();

		$(".password").css("background-color", "#f2dede");

        $(".pw_alert").html("Passwords do not match!").css("color", "#a94442");

        $("#submit").prop('disabled', true).trigger('create');
        //deny button
    }else{
    	$(".pw_alert").empty();

    	$(".password").css("background-color", "#dff0d8");

        $(".pw_alert").html("Passwords match.").css("color", "#3c763d");

        $("#submit").prop('disabled', false).trigger('create');

}

});


//and one for emails

$("#email, #email_confirm").keyup(function(){

var email = $("#email").val();
var	email_confirm = $("#email_confirm").val();

if( !email || !email_confirm){
	$(".email_alert").empty();
	$(".email").css("background-color", "");

} else if (email != email_confirm){
		$(".email_alert").empty();

		$(".email").css("background-color", "#f2dede");

        $(".email_alert").html("emails do not match!").css("color", "#a94442");

        $("#submit").prop('disabled', true).trigger('create');
        //deny button
    }else{
    	$(".email_alert").empty();

    	$(".email").css("background-color", "#dff0d8");

        $(".email_alert").html("emails match.").css("color", "#3c763d");

        $("#submit").prop('disabled', false).trigger('create');

}

});




});