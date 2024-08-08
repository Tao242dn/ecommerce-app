'use strict';

import findById from '../services/apikey.service.js';
import { ForBiddenError } from '../core/error.response.js';

const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization',
};

export const checkApiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) throw new ForBiddenError('Do not get api-key');

    // check objKey
    const objKey = await findById(key);
    if (!objKey) throw new ForBiddenError('Forbidden error. Please try again');

    req.objKey = objKey;
    return next();
  } catch (err) {}
};

export const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) throw new ForBiddenError('Do not get permission role');

    const validPermission = req.objKey.permissions.includes(permission);

    if (!validPermission) throw new ForBiddenError('Permission denied. Please try again');

    return next();
  };
};
