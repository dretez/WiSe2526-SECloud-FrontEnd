"use strict";

import * as api_auth from "../api/auth.js";

let session = false;
let currentUser = null;

const loginBtn = document.querySelector("header .login");
const logoutBtn = document.querySelector("header .logout");
const profileImages = document.querySelectorAll(".profileImage");

let api;

function renderSession() {
  if (session) {
    logoutBtn.classList.remove("hide");
    loginBtn.classList.add("hide");
  } else {
    logoutBtn.classList.add("hide");
    loginBtn.classList.remove("hide");
  }

  profileImages.forEach((element) => {
    if (session && currentUser?.profileImageUrl) {
      element.src = currentUser.profileImageUrl;
      element.classList.remove("hide");
    } else {
      element.removeAttribute("src");
      element.classList.add("hide");
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
  try {
    const user = await api_auth.me(api);
    if (typeof user !== "undefined") {
      startSession(user);
    }
  } catch (_error) {
    endSession();
  }
}

logoutBtn.addEventListener("click", async () => {
  if (typeof api !== "undefined") {
    try {
      await api_auth.logout(api);
    } catch (error) {
      console.error("Failed to log out", error);
    }
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

renderSession();
