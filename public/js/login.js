// ######################### LOGIN PAGE ####################
const headerWhat = "What";
const headerWhy = "Why";
const headerHow = "How";

const paragraphWhat = "Twitter is a service for friends, family, anc co-workers to communicate and stay connected through the exchange of quick, frequent answers to one simple questions: <strong>What are you doing?</strong>";
const paragraphWhy = "Twitter is easy to use and it is completely free. Communicating with your friends, family and co-workers has never been this easy. Most of all, the most important thing is; Twitter is <strong>completely safe.</strong>";
const paragraphHow = "All you have to do is create an account and find whoever you want! You can connect, communicate and get know about them with Twitter. Click the button below and get started! It is <strong>really easy.</strong>";

$(".l-wwh-button").click(function(){
  const selected = this.textContent;

  $(".l-wwh-button").removeClass("l-wwh-enabled");
  $(".l-wwh-button").addClass("l-wwh-disabled");

  $(this).removeClass("l-wwh-disabled");
  $(this).addClass("l-wwh-enabled");

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

  $(".l-header-wwh").text(header);
  $(".l-twitter-paragraph").html(paragraph);
});

$(".l-get-start").click(function(){
  window.location.href = "/register";
});
