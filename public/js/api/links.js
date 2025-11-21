"use strict";

const create = async (api, longUrl, alias = "") => {
  let output;
  await api.post(
    "/api/links",
    alias !== "" ? { longUrl: longUrl, alias: alias } : { longUrl: longUrl },
    { 400: "Invalid URL or alias taken", 401: "Unauthorized access" },
    async (response) => {
      let data = await response.json();
      output = { id: data.id, shortUrl: data.shortUrl };
    },
  );
  return output;
};

const mine = async (api) => {
  let output = [];
  api.get(
    "/api/links/mine",
    { 401: "Unauthorized access" },
    async (response) => {
      let mylinks = await response.json();
      mylinks.forEach((link) => {
        output.push(link);
      });
    },
    (status) => {
      throw new Error(status);
    },
  );
  return output;
};

const meta = async (api, id) => {
  api.get(
    `/api/links/${id}/meta`,
    { 401: "Unauthorized access", 403: "Not owner", 404: "Not found" },
    async (response) => {
      let metadata = await response.json();
      console.log(metadata);
    },
  );
};

const toggle = async (api, id, isActive) => {
  await api.patch(
    `/api/links/${id}`,
    { isActive: isActive },
    {
      400: `Bad body, expected: boolean, received: ${typeof isActive}`,
      401: "Unauthorized access",
      403: "Not owner",
      404: "Not found",
    },
    () => {}, // nothing to handle
    (status) => {
      throw new Error(status);
    },
  );
};

export { create, mine, meta, toggle };
