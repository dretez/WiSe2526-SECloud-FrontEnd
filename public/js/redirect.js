"use strict";

import * as api_redirect from "./api/redirect.js";

const setupAPICalls = (apiObj) => {
  let api = apiObj;

  let path = window.location.pathname;
  path = path.substring(1, path.length);

  if (path !== "/" && path !== "") {
    api_redirect.to(api, path);
  }
};

export { setupAPICalls };
