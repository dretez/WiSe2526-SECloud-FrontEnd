"use strict";

import "./firebase.js";

import API from "./api/api.js";

const api = new API(
  window.__API_BASE_URL__ ??
    document
      .querySelector("meta[name=api-base-url]")
      ?.getAttribute("content")
      ?.trim()
      .replace(/\/$/, "") ??
    window.location.origin,
);

import * as url from "./urlRequest.js";
import * as auth from "./auth/auth.js";
import { Dashboard } from "./dashboard/dashboard.js";
import * as redirect from "./redirect.js";

new Dashboard(api);

auth.setupAPICalls(api);
url.setupAPICalls(api);
redirect.setupAPICalls(api);

document.querySelectorAll(".floating").forEach((pane) => {
  pane.querySelectorAll(".closePane").forEach((e) => {
    e.addEventListener("click", () => {
      pane.classList.remove("display");
    });
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && pane.classList.contains("display"))
      pane.classList.remove("display");
  });
});
