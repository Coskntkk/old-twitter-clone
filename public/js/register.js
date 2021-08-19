// ######################### REGISTER PAGE ####################
$('#signupUserName').on('input', function() {
  var content = $('#signupUserName').val();
  if(content.includes(" ")){
    $("#yourUrl").css( "color", "red" );
  } else {
    $("#yourUrl").css( "color", "black" );
  }
  $("#yourUrl").text(content);
});
