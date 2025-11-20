"use strict";

const create = async (api, longUrl, alias = "") => {
  const data = await api.post(
    "/api/links",
    alias != "" ? { longUrl: longUrl, alias: alias } : { longUrl: longUrl },
    { 400: "Invalid URL or alias taken", 401: "Unauthorized access" },
    async (response) => {
      return await response.json();
    },
  );
  return data;
};

const mine = async (api) => {
  const data = await api.get(
    "/api/links/mine",
    { 401: "Unauthorized access" },
    async (response) => {
      return await response.json();
    },
    (status) => {
      throw new Error(status);
    },
  );
  return data?.items ?? [];
};

const meta = async (api, id) => {
  return await api.get(
    `/api/links/${id}/meta`,
    { 401: "Unauthorized access", 403: "Not owner", 404: "Not found" },
    async (response) => {
      return await response.json();
    },
  );
};

const toggle = async (api, id, isActive) => {
  return await api.patch(
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
