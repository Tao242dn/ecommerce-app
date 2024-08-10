'use strict';

import jwt from 'jsonwebtoken';
import asyncHandler from '../helpers/asyncHandler.js';
import { AuthFailureError, NotFoundError } from '../core/error.response.js';
import KeyTokenService from '../services/keyToken.service.js';

const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization',
  REFRESH_TOKEN: 'x-token-id',
};

export const createTokenPair = (payload, publicKey, privateKey) => {
  const accessToken = jwt.sign(payload, publicKey, {
    expiresIn: '2 days',
  });

  const refreshToken = jwt.sign(payload, privateKey, {
    expiresIn: '7 days',
  });

  return { accessToken, refreshToken };
};

export const authentication = asyncHandler(async (req, res, next) => {
  // 1. Get x-client-id from header
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError('Do not get client id');

  // 2. Get key store in db based on userId
  const keyStore = await KeyTokenService.findByUserId(userId);
  if (!keyStore) throw new NotFoundError('Not found keystore');

  // 3. Authentication when refresh token be used create new token pair (access token and refresh token)
  if (req.headers[HEADER.REFRESH_TOKEN]) {
    try {
      const refreshToken = req.headers[HEADER.REFRESH_TOKEN];
      if (!refreshToken) throw new AuthFailureError('Do not get refresh token');
      const decodeUser = jwt.verify(refreshToken, keyStore.privateKey);
      if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid UserId');
      req.keyStore = keyStore;
      req.user = decodeUser;
      req.refreshToken = refreshToken;
      return next();
    } catch (err) {
      throw err;
    }

    // Authentication when user get, post, patch, delete method http and logout
  } else {
    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) throw new AuthFailureError('Do not get access token');
    try {
      const decodeUser = jwt.verify(accessToken, keyStore.publicKey);
      if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid UserId');
      req.keyStore = keyStore;
      req.user = decodeUser;
      return next();
    } catch (err) {
      throw err;
    }
  }
});

