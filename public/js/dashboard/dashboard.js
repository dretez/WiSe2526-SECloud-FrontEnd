"use strict";

import * as api_links from "../api/links.js";

import { LinkComponent } from "./linkComponent.js";

const openButtons = document.querySelectorAll(".openDashboard");
const dashboard = document.querySelector("#my-dashboard");
const listDisplay = dashboard.querySelector("ul.link-list");
const applyChangesBtn = dashboard.querySelector("button[name=applyChanges]");

openButtons.forEach((e) =>
  e.addEventListener("click", () => {
    dashboard.classList.add("display");
  }),
);

const testLinks = (api) => [
  new LinkComponent(api, 123, "https://one.one.one.one/", 23, "-", "-", false),
  new LinkComponent(api, 123, "https://one.one.one.one/", 23, "-", "-", true),
];

class Dashboard {
  #api;
  #links;

  constructor(api) {
    this.#api = api;
    this.#links = [];
    applyChangesBtn.addEventListener("click", () => this.commit());

    openButtons.forEach((e) =>
      e.addEventListener("click", () => {
        this.load();
      }),
    );
  }

  async load() {
    this.#links.forEach((l) => {
      if (typeof l.element !== "undefined") l.element.remove();
    });
    let linklist;
    try {
      linklist = api_links.mine(this.#api);
      this.#links = linklist.map(
        (l) =>
          new LinkComponent(
            l.id,
            l.longUrl,
            l.hitCount,
            l.lastHitAt,
            l.createdAt,
            l.isActive,
          ),
      );
      this.#links.forEach((e) => {
        listDisplay.appendChild(e.element);
      });
    } catch (status) {
      this.#links = testLinks(this.#api);
      this.#links.forEach((e) => {
        listDisplay.appendChild(e.element);
      });
      // warn user about failure
    }
  }

  async commit() {
    this.#links.forEach((l) => {
      l.commit();
    });
  }
}

export { Dashboard };
