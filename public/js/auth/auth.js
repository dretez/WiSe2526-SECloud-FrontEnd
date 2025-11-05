"use strict";

import * as api_auth from "../api/auth.js";
import * as session from "./session.js";

const authScreen = document.querySelector("#authScreen");
// const clseButtons = authScreen.querySelectorAll(".closePane");
const openButtons = document.querySelectorAll(".openAuthScreen");
const authEnterBtn = authScreen.querySelector("input[name=authenter]");
const loginForm = authScreen.querySelector("#loginForm");
const emailInput = loginForm.querySelector("input[name=email]");
const passwordInput = loginForm.querySelector("input[name=password]");

const authOpts = {
  login: [...authScreen.querySelectorAll(".authMethodSelector > .authLogin")],
  register: [
    ...authScreen.querySelectorAll(".authMethodSelector > .authRegister"),
  ],
};

let selectedAuthOpt = "login";

let api;

/*============================== INITIALIZATION ==============================*/

setAuthOpt(selectedAuthOpt);

/*============================= EVENT LISTENERS =============================*/

// clseButtons.forEach((e) => e.addEventListener("click", () => hideAuthScreen()));
openButtons.forEach((e) => e.addEventListener("click", () => showAuthScreen()));

Object.entries(authOpts).forEach(([key, val]) => {
  val.forEach((e) => e.addEventListener("click", () => setAuthOpt(key)));
});

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let email = emailInput.value;
  let password = passwordInput.value;

  if (typeof api !== "undefined") {
    api_auth[selectedAuthOpt](api, email, password);
  } else {
    console.error("Error: No API specified to be used for authentication");
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && authScreen.classList.contains("display")) {
    hideAuthScreen();
  }
});

/*================================ FUNCTIONS ================================*/

function showAuthScreen() {
  authScreen.classList.add("display");
}

function hideAuthScreen() {
  authScreen.classList.remove("display");
}

function setAuthOpt(opt) {
  selectedAuthOpt = opt;
  Object.entries(authOpts).forEach(([key, val]) => {
    val.forEach((e) => e.classList[key === opt ? "add" : "remove"]("selected"));
  });
}

/*=================================== API ===================================*/

function setupAPICalls(apiObj) {
  api = apiObj;
  session.setupAPICalls(apiObj);
}

export { setupAPICalls, hideAuthScreen, showAuthScreen };
