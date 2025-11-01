"use strict";

import API from "./api/api.js";
import * as api_links from "./api/links.js";
import * as api_redirect from "./api/redirect.js";

const api = new API("our/api/here");

import "./urlRequest.js";
import * as auth from "./auth/auth.js";

auth.setupAPICalls(api);
