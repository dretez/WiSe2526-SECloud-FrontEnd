"use strict";

import API from "./api/api.js";

const api = new API("our/api/here");

import * as url from "./urlRequest.js";
import * as auth from "./auth/auth.js";

auth.setupAPICalls(api);
url.setupAPICalls(api);
