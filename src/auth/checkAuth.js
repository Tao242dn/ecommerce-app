"use strict";

import findById from "../services/apikey.service.js";
import { ForBiddenError } from "../core/error.response.js";

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};

export const checkApiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) throw new ForBiddenError("Forbidden Error");

    // check objKey
    const objKey = await findById(key);
    if (!objKey) throw new ForBiddenError("Forbidden Error");

    req.objKey = objKey;
    return next();
  } catch (err) {}
};

export const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) throw new ForBiddenError("Permission Denied");

    const validPermission = req.objKey.permissions.includes(permission);

    if (!validPermission) throw new ForBiddenError("Permission Denied");

    return next();
  };
};
