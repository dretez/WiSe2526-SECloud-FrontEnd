"use strict";

import * as api_links from "./api/links.js";

let form = document.querySelector("#urlInput");
let urlinput = form.querySelector("input[name=url]");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  urlRequest();
});

async function urlRequest() {
  let url = urlinput.value.length == 0 ? urlinput.placeholder : urlinput.value;
  url = parseURL(url);
  console.log(await api_links.create(api, url));
}

const parseURL = (url) => {
  let split = url.split("://", 2);
  if (split.length != 2) split.splice(0, 0, "https"); // assume schemeless urls use https scheme
  if (!split[1].includes("/")) split[1] = split[1] + "/";
  return split.join("://");
};

let api;

function setupAPICalls(apiObj) {
  api = apiObj;
}

export { setupAPICalls };
