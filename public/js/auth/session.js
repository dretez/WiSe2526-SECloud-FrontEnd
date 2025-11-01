"use strict";

import * as api_auth from "../api/auth.js";

const loginBtn = document.querySelector("header .login");
const logoutBtn = document.querySelector("header .logout");

let api;

function startSession() {
  logoutBtn.classList.remove("hide");
  loginBtn.classList.add("hide");
}

function endSession() {
  logoutBtn.classList.add("hide");
  loginBtn.classList.remove("hide");
}

logoutBtn.addEventListener("click", () => {
  if (typeof api !== "undefined") {
    api_auth.logout(api);
  } else {
    console.error("Error: No API specified to be used for authentication");
  }
});

/*=================================== API ===================================*/

function setupAPICalls(apiObj) {
  api = apiObj;
}

export { startSession, endSession, setupAPICalls };
