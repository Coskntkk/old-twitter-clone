var input  = document.querySelector('#signupUserName');
    output = document.querySelector("#yourUrl");

function keydownHandler() {
  output.innerHTML = (this.value.split(" ").join("-")).toLowerCase();
}

input.addEventListener("input", keydownHandler);