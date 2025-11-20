"use strict";

import * as api_links from "./api/links.js";

let form = document.querySelector("#urlInput");
let urlinput = form.querySelector("input[name=url]");
let shortUrlContainer = document.querySelector("#shortUrlContainer");
let shorturlDisplay = shortUrlContainer.querySelector(".shortUrl");
let copybtn = shortUrlContainer.querySelector("img");
let shortUrlDefined = false;
let lastShortUrl = "";

form.addEventListener("submit", (e) => {
  e.preventDefault();
  urlRequest();
});

async function urlRequest() {
  let url = urlinput.value.length == 0 ? urlinput.placeholder : urlinput.value;
  url = parseURL(url);
  
  // Show loading state
  const submitBtn = form.querySelector('input[type="submit"]');
  const originalValue = submitBtn.value;
  submitBtn.disabled = true;
  submitBtn.value = "Shortening...";
  shorturlDisplay.textContent = "⏳ Creating short URL...";
  shortUrlDefined = false;
  
  try {
    let api_output = await api_links.create(api, url);
    shortUrlDefined = typeof api_output != "undefined" && typeof api_output.shortUrl === "string";
    if (shortUrlDefined) {
      lastShortUrl = api_output.shortUrl;
      shorturlDisplay.textContent = api_output.shortUrl;
      shortUrlContainer.style.borderColor = "rgba(40, 167, 69, 0.5)";
      // Reset border color after 2 seconds
      setTimeout(() => {
        shortUrlContainer.style.borderColor = "rgba(102, 126, 234, 0.2)";
      }, 2000);
    } else {
      shorturlDisplay.textContent = "❌ Error: Could not create short URL. Please try again.";
      shortUrlContainer.style.borderColor = "rgba(220, 53, 69, 0.5)";
    }
  } catch (error) {
    shortUrlDefined = false;
    const errorMsg = error?.message || "Unknown error";
    shorturlDisplay.textContent = `❌ Error: ${errorMsg}`;
    shortUrlContainer.style.borderColor = "rgba(220, 53, 69, 0.5)";
    console.error("URL shortening error:", error);
  } finally {
    submitBtn.disabled = false;
    submitBtn.value = originalValue;
  }
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
  try {
    await copyToClipboard(lastShortUrl);
    // Visual feedback
    const originalSrc = copybtn.src;
    copybtn.style.transform = "scale(1.2)";
    copybtn.style.filter = "brightness(1.2)";
    setTimeout(() => {
      copybtn.style.transform = "scale(1)";
      copybtn.style.filter = "brightness(1)";
    }, 200);
  } catch (error) {
    console.error("Failed to copy:", error);
    alert("Failed to copy to clipboard. Please copy manually.");
  }
});

function setupAPICalls(apiObj) {
  api = apiObj;
}

export { setupAPICalls };
