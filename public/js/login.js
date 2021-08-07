$(".wwh-button").click(function(){
  $(".wwh-button").removeClass("wwh-enabled");
  $(".wwh-button").addClass("wwh-disabled");

  $(this).removeClass("wwh.disabled");
  $(this).addClass("wwh-enabled");

  console.log(this.textContent);
})
