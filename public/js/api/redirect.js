"use strict";

const to = (api, id) => {
  api.get(`/${id}`, { 404: "URL not found" }, () => {});
};

export { to };
