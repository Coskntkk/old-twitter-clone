const headerWhat = "What";
const headerWhy = "Why";
const headerHow = "How";

const paragraphWhat = "Twitter is a service for friends, family, anc co-workers to communicate and stay connected through the exchange of quick, frequent answers to one simple questions: <strong>What are you doing?</strong>";
const paragraphWhy = "Twitter is easy to use and it is completely free. Communicating with your friends, family and co-workers has never been this easy. Most of all, the most important thing is; Twitter is <strong>completely safe.</strong>";
const paragraphHow = "All you have to do is create an account and find whoever you want! You can connect, communicate and get know about them with Twitter. Click the button below and get started! It is <strong>really easy.</strong>";

$(".wwh-button").click(function(){
  const selected = this.textContent;

  $(".wwh-button").removeClass("wwh-enabled");
  $(".wwh-button").addClass("wwh-disabled");

  $(this).removeClass("wwh-disabled");
  $(this).addClass("wwh-enabled");

  if ( selected == "How?" ) {
    header = headerHow;
    paragraph = paragraphHow;
  } else if ( selected == "Why?" ) {
    header = headerWhy;
    paragraph = paragraphWhy;
  } else if ( selected == "What?" ) {
    header = headerWhat;
    paragraph = paragraphWhat;
  }

  $(".header-wwh").text(header);
  $(".twitter-paragraph").html(paragraph);
})

$(".get-start").click(function(){
  window.location.href = "/account";
})
