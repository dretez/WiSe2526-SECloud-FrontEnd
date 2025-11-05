"use strict";

class LinkComponent {
  #id;
  #longUrl;
  #hitCount;
  #lastHit;
  #createdAt;
  #isActive;
  #toggled;

  constructor(
    id,
    longUrl,
    hitCount,
    lastHit,
    createdAt,
    isActive,
    toggled = false,
  ) {
    this.#id = id;
    this.#longUrl = longUrl;
    this.#hitCount = hitCount;
    this.#lastHit = lastHit;
    this.#createdAt = createdAt;
    this.#isActive = isActive;
    this.#toggled = toggled;

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

    this.element.classList[this.#toggled ? "add" : "remove"]("big");
    this.element.addEventListener("click", () => {
      this.#toggled = !this.#toggled;
      this.element.classList[this.#toggled ? "add" : "remove"]("big");
    });

    this.element.querySelector("input").addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }
}

export { LinkComponent };
