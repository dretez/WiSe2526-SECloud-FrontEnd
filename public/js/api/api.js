"use strict";

class API {
  #url;

  constructor(url) {
    this.#url = (url ?? "").replace(/\/$/, "");
  }

  get baseUrl() {
    return this.#url;
  }

  async #request(path, init, statusDict = {}, responseHandler, errorHandler) {
    try {
      const response = await fetch(this.#url + path, {
        credentials: "include",
        ...init,
      });

      if (!response.ok) {
        const message = Object.prototype.hasOwnProperty.call(statusDict, response.status)
          ? statusDict[response.status]
          : `Unexpected HTTP status: ${response.status}`;
        const error = new Error(message);
        error.status = response.status;
        throw error;
      }

      if (typeof responseHandler === "function") {
        return await responseHandler(response);
      }
      return undefined;
    } catch (error) {
      console.error("API error:", error.message ?? error);
      if (typeof errorHandler === "function") {
        await errorHandler(error.status);
      }
      throw error;
    }
  }

  async get(path, statusDict, responseHandler, errorHandler) {
    return await this.#request(
      path,
      { method: "GET" },
      statusDict,
      responseHandler,
      errorHandler,
    );
  }

  async post(path, data, statusDict, responseHandler, errorHandler) {
    return await this.#request(
      path,
      {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      },
      statusDict,
      responseHandler,
      errorHandler,
    );
  }

  async patch(path, data, statusDict, responseHandler, errorHandler) {
    return await this.#request(
      path,
      {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      },
      statusDict,
      responseHandler,
      errorHandler,
    );
  }

  async upload(path, formData, statusDict, responseHandler, errorHandler) {
    return await this.#request(
      path,
      {
        method: "POST",
        body: formData,
      },
      statusDict,
      responseHandler,
      errorHandler,
    );
  }
}

export default API;
