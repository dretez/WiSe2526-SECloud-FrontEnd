"use strict";

class Dashboard {
  #api;
  #links;

  constructor(api) {
    this.#api = api;
    this.#links = [];
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
      this.#links = [
        new LinkComponent(123, "https://one.one.one.one/", 23, "-", "-", false),
        new LinkComponent(
          123,
          "https://one.one.one.one/",
          23,
          "-",
          "-",
          true,
          true,
        ),
      ];
      this.#links.forEach((e) => {
        listDisplay.appendChild(e.element);
      });
      // warn user about failure
    }
  }
}

export { Dashboard };
