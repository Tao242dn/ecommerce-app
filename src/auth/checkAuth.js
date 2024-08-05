"use strict";

import findById from "../services/apikey.service.js";

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};

export const checkApiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      return res.status(403).json({
        message: "Forbidden Error",
      });
    }

    // check objKey
    const objKey = await findById(key);
    if (!objKey) {
      return res.status(403).json({
        message: "Forbidden Error",
      });
    }

    req.objKey = objKey;
    return next();
  } catch (err) {}
};

export const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      return res.status(403).json({
        message: "Permission Denied",
      });
    }

    const validPermission = req.objKey.permissions.includes(permission);

    if (!validPermission) {
      return res.status(403).json({
        message: "Permission Denied",
      });
    }

    return next();
  };
};

// export const asyncHandler = (fn) => {
//   return (req, res, next) => {
//     fn(req, res, next).catch(next);
//   };
// };
