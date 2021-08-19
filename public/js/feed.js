$("#tweet").on('change keyup paste', function(){
  let typed = $("#tweet").val();
  console.log(typed.length);
  $(".140").text(140-(typed.length));
});
