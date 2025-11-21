"use strict";

import * as api_auth from "../api/auth.js";

let session = false;
let currentUser = null;

const loginBtn = document.querySelector("header .login");
const logoutBtn = document.querySelector("header .logout");
const profileImages = document.querySelectorAll(".profileImage");

let api;

function renderSession() {
  logoutBtn.classList[session ? "remove" : "add"]("hide");
  loginBtn.classList[session ? "add" : "remove"]("hide");

  profileImages.forEach((e) => {
    if (session && currentUser?.profileImageUrl) {
      e.src = currentUser.profileImageUrl;
      e.classList.remove("hide");
    } else {
      e.removeAttribute("src");
      e.classList.add("hide");
    }
  });
}

function startSession(user) {
  session = true;
  currentUser = user ?? currentUser;
  renderSession();
}

function endSession() {
  session = false;
  currentUser = null;
  renderSession();
}

async function initializeSession() {
  if (typeof api === "undefined") return;
  api_auth.me(api);
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
  initializeSession();
}

function isAuthenticated() {
  return session;
}

function getCurrentUser() {
  return currentUser;
}

function updateProfileImage(url) {
  if (!session) return;
  currentUser = { ...currentUser, profileImageUrl: url };
  renderSession();
}

export {
  startSession,
  endSession,
  setupAPICalls,
  isAuthenticated,
  getCurrentUser,
  updateProfileImage,
};
