"use strict";

const to = (api, id) => {
  api.get(`/${id}`, { 404: "URL not found" }, async (response) => {
    let data = await response.json();
    console.log(data);
    console.log(data.longUrl);
    // redirect to longUrl
  });
};

export { to };
