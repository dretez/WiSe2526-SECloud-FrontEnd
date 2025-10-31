"use strict";

let form = document.querySelector("#urlInput");
let urlinput = form.querySelector("input[name=url]");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  urlRequest();
});

function urlRequest() {
  let url = urlinput.value.length == 0 ? urlinput.placeholder : urlinput.value;
  console.log(url);
  // request shortened url from the backend
}
