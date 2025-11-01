"use strict";

var selectedAuthOpt;

let authscreen = document.querySelector("#authScreen");

authscreen.querySelectorAll(".closePane").forEach((e) => {
  e.addEventListener("click", () => {
    authscreen.classList.remove("display");
  });
});

document.querySelectorAll(".openAuthScreen").forEach((e) => {
  e.addEventListener("click", () => {
    authscreen.classList.add("display");
  });
});

const authOpts = {
  login: Array.from(
    authscreen.querySelectorAll(".authMethodSelector > .authLogin"),
  ),
  register: Array.from(
    authscreen.querySelectorAll(".authMethodSelector > .authRegister"),
  ),
};

setAuthOpt("login");

for (const [key, val] of Object.entries(authOpts)) {
  val.forEach((e) => e.addEventListener("click", () => setAuthOpt(key)));
}

const authEnterBtn = authscreen.querySelector("input[name=authenter]");
authscreen.querySelector("#loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
});

/*================================ FUNCTIONS ================================*/

function setAuthOpt(opt) {
  selectedAuthOpt = opt;
  for (const [key, val] of Object.entries(authOpts)) {
    val.forEach((e) => e.classList[key === opt ? "add" : "remove"]("selected"));
  }
}
