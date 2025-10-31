"use strict";

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
