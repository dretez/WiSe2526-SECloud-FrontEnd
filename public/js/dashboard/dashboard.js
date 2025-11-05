"use strict";

let api;

import { LinkComponent } from "./linkComponent.js";

const openButtons = document.querySelectorAll(".openDashboard");
const dashboard = document.querySelector("#my-dashboard");
const listDisplay = dashboard.querySelector("ul.link-list");

openButtons.forEach((e) =>
  e.addEventListener("click", () => {
    dashboard.classList.add("display");
  }),
);

let arr = [
  new LinkComponent(123, "https://one.one.one.one/", 23, "-", "-", false),
  new LinkComponent(123, "https://one.one.one.one/", 23, "-", "-", true, true),
];

arr.forEach((e) => {
  listDisplay.appendChild(e.element);
});

function setupAPICalls(apiObj) {
  api = apiObj;
}

export { setupAPICalls };
