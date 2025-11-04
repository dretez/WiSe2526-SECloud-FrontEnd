"use strict";

import * as api_links from "./api/links.js";

let form = document.querySelector("#urlInput");
let urlinput = form.querySelector("input[name=url]");
let shortUrlContainer = document.querySelector("#shortUrlContainer");
let shorturlDisplay = shortUrlContainer.querySelector(".shortUrl");
let copybtn = shortUrlContainer.querySelector("img");
let shortUrlDefined = false;

form.addEventListener("submit", (e) => {
  e.preventDefault();
  urlRequest();
});

async function urlRequest() {
  let url = urlinput.value.length == 0 ? urlinput.placeholder : urlinput.value;
  url = parseURL(url);
  let api_output = await api_links.create(api, url);
  console.log(api_output);
  shortUrlDefined = typeof api_output != "undefined";
  shorturlDisplay.textContent = shortUrlDefined
    ? api_output
    : "There was an error getting your shortened url, please try again.";
}

const copyToClipboard = async (text) => {
  await navigator.clipboard.writeText(text);
};

const parseURL = (url) => {
  let split = url.split("://", 2);
  if (split.length != 2) split.splice(0, 0, "https"); // assume schemeless urls use https scheme
  if (!split[1].includes("/")) split[1] = split[1] + "/";
  return split.join("://");
};

let api;
copybtn.addEventListener("click", async () => {
  if (!shortUrlDefined) return;
  await copyToClipboard(shorturlDisplay.textContent);
});

function setupAPICalls(apiObj) {
  api = apiObj;
}

export { setupAPICalls };
