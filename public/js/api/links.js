"use strict";

const create = (api, longUrl, alias = "") => {
  api.post(
    "/api/links",
    alias != "" ? { longUrl: longUrl, alias: alias } : { longUrl: longUrl },
    { 400: "Invalid URL or alias taken", 401: "Unauthorized access" },
    async (response) => {
      let data = await response.json();
      console.log(data);
      console.log(data.id);
      console.log(data.shortUrl);
    },
  );
};

const mine = (api) => {
  api.get(
    "/api/links/mine",
    { 401: "Unauthorized access" },
    async (response) => {
      let mylinks = await response.json();
      mylinks.forEach((link) => {
        console.log(link);
        console.log(link.id);
        console.log(link.longUrl);
        console.log(link.isActive);
        console.log(link.hitCount);
        if ("lastHitAt" in link) console.log(link.lastHitAt);
        if ("createdAt" in link) console.log(link.createdAt);
      });
    },
  );
};

const meta = (api, id) => {
  api.get(
    `/api/links/${id}/meta`,
    { 401: "Unauthorized access", 403: "Not owner", 404: "Not found" },
    async (response) => {
      let metadata = await response.json();
      console.log(metadata);
    },
  );
};

const toggle = (api, id, isActive) => {
  api.patch(
    `/api/links/${id}`,
    { isActive: isActive },
    {
      400: `Bad body, expected: boolean, received: ${typeof isActive}`,
      401: "Unauthorized access",
      403: "Not owner",
      404: "Not found",
    },
    () => {}, // nothing to handle
  );
};

export { create, mine, meta, toggle };
