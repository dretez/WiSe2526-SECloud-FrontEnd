"use strict";

import * as api_auth from "../api/auth.js";
import * as session from "./session.js";

const authScreen = document.querySelector("#authScreen");
const openButtons = document.querySelectorAll(".openAuthScreen");
const authErrorDisplay = authScreen.querySelectorAll(".authError");
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

openButtons.forEach((e) => e.addEventListener("click", () => showAuthScreen()));

Object.entries(authOpts).forEach(([key, val]) => {
  val.forEach((e) => e.addEventListener("click", () => setAuthOpt(key)));
});

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  setAuthError("");
  authEnterBtn.disabled = true;
  let email = emailInput.value.trim();
  let password = passwordInput.value;

  if (typeof api !== "undefined") {
    api_auth[selectedAuthOpt](api, email, password);
    passwordInput.value = "";
  } else {
    console.error("Error: No API specified to be used for authentication");
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

function setAuthError(message) {
  if (!authErrorDisplay) return;
  if (message && message.length > 0) {
    authErrorDisplay.textContent = message;
    authErrorDisplay.classList.remove("hide");
  } else {
    authErrorDisplay.textContent = "";
    authErrorDisplay.classList.add("hide");
  }
}

/*=================================== API ===================================*/

function setupAPICalls(apiObj) {
  api = apiObj;
  session.setupAPICalls(apiObj);
}

export { setupAPICalls, hideAuthScreen, showAuthScreen, setAuthError };
