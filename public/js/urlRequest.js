"use strict";

import * as api_links from "./api/links.js";

let form = document.querySelector("#urlInput");
let urlinput = form.querySelector("input[name=url]");
let shortUrlContainer = document.querySelector("#shortUrlContainer");
let shorturlDisplay = shortUrlContainer.querySelector(".shortUrl");
let copybtn = shortUrlContainer.querySelector("img");
let shortUrlDefined = false;
const submitBtn = form.querySelector('input[type="submit"]');

form.addEventListener("submit", (e) => {
  e.preventDefault();
  urlRequest();
});

async function urlRequest() {
  let url = urlinput.value.length == 0 ? urlinput.placeholder : urlinput.value;
  url = parseURL(url);

  submitBtn.disabled = true;
  submitBtn.value = "Shortening...";
  shorturlDisplay.textContent = "⏳ Creating short URL...";
  shortUrlDefined = false;

  let api_output = await api_links.create(api, url);
  console.log(api_output);
  
  if (api_output && api_output.shortUrl) {
    shortUrlDefined = true;
    shorturlDisplay.textContent = api_output.shortUrl;
  } else {
    shortUrlDefined = false;
    // Use the specific error message from backend if available
    shorturlDisplay.textContent = api_output && api_output.error 
      ? `Error: ${api_output.error}`
      : "Error: Could not create short URL. Please try logging out and in again.";
  }

  shortUrlContainer.classList.add(shortUrlDefined ? "success" : "error");
  if (shortUrlDefined) {
    shortUrlContainer.classList.remove("error");
    setTimeout(() => {
      shortUrlContainer.classList.remove("success");
    }, 2000);
  }

  submitBtn.disabled = false;
  submitBtn.value = "Shorten URL";
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
  copybtn.classList.add("copyAvailable");
  setTimeout(() => {
    copybtn.classList.remove("copyAvailable");
  }, 500);
});

function setupAPICalls(apiObj) {
  api = apiObj;
}

export { setupAPICalls };
