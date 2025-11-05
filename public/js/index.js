"use strict";

import API from "./api/api.js";

const api = new API("our/api/here");

import * as url from "./urlRequest.js";
import * as auth from "./auth/auth.js";
import * as dashboard from "./dashboard/dashboard.js";
import * as redirect from "./redirect.js";

auth.setupAPICalls(api);
url.setupAPICalls(api);
dashboard.setupAPICalls(api);
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
