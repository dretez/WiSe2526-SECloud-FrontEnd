"use strict";

import API from "./api/api.js";

const api = new API("our/api/here");

import * as url from "./urlRequest.js";
import * as auth from "./auth/auth.js";
import * as dashboard from "./dashboard/dashboard.js";

auth.setupAPICalls(api);
url.setupAPICalls(api);
dashboard.setupAPICalls(api);

document.querySelectorAll(".floating").forEach((pane) => {
  pane.querySelectorAll(".closePane").forEach((e) => {
    e.addEventListener("click", () => {
      pane.classList.remove("display");
    });
  });
});
