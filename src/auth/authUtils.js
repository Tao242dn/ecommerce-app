"use strict";

import jwt from "jsonwebtoken";
import asyncHandler from "../helpers/asyncHandler.js";
import { AuthFailureError, NotFoundError } from "../core/error.response.js";
import KeyTokenService from "../services/keyToken.service.js";

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
};

export const createTokenPair = (payload, publicKey, privateKey) => {
  const accessToken = jwt.sign(payload, publicKey, {
    expiresIn: "2 days",
  });

  const refreshToken = jwt.sign(payload, privateKey, {
    expiresIn: "7 days",
  });

  return { accessToken, refreshToken };
};

export const authentication = asyncHandler(async (req, res, next) => {
  
  // 1. Get x-client-id ()
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError("Invalid Request");

  // 2. Find id in db based on user id and get (public key)
  const keyStore = await KeyTokenService.findByUserId(userId);
  if (!keyStore) throw new NotFoundError("Not found keystore");

  // 3. GET authorization (access token)
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError("Invalid Request");
  
  // 4. Verify user used access token and public key
  try {
    const decodeUser = jwt.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId)
      throw new AuthFailureError("Invalid UserId");

    req.keyStore = keyStore;
    console.log(`Request keystore: ${req.keyStore._id}`)
    return next();
  } catch (err) {
    throw err;
  }
});
