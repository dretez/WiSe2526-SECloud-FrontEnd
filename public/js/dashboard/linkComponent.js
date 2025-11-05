"use strict";

import * as api_links from "../api/links.js";

class LinkComponent {
  #displayToggled;
  #id;
  #isActive;
  #api;

  constructor(
    api,
    id,
    longUrl,
    hitCount,
    lastHit,
    createdAt,
    isActive,
    toggled = false,
  ) {
    this.#api = api;
    this.#id = id;
    this.#isActive = isActive;
    this.#displayToggled = toggled;

    this.element = document.createElement("li");
    this.element.innerHTML = `
<div class="longUrl">${longUrl}</div>
<div class="id">${id}</div>
<div class="hitCount">${hitCount}</div>
<div class="lastHitAt">${typeof lastHit == "undefined" ? "-" : lastHit}</div>
<div class="createdAt">${typeof createdAt == "undefined" ? "-" : createdAt}</div>
<div class="isActive">
  <input type="checkbox" name="activeLinkToggle" value=""${isActive ? " checked" : ""}/>
</div>
    `;

    this.element.classList[this.#displayToggled ? "add" : "remove"]("big");
    this.element.addEventListener("click", () => {
      this.#displayToggled = !this.#displayToggled;
      this.element.classList[this.#displayToggled ? "add" : "remove"]("big");
    });

    this.element.querySelector("input").addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }

  async commit() {
    const activeToggle = this.element.querySelector(
      "input[name=activeLinkToggle",
    );
    if (activeToggle.checked === this.#isActive) return;
    try {
      await api_links.toggle(this.#api, this.#id, activeToggle.checked);
      this.#isActive = activeToggle.checked;
    } catch (error) {}
  }
}

export { LinkComponent };
