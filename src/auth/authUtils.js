"use strict";

import jwt from "jsonwebtoken";

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // access token
    // private key don't save db, create one time when we login or sign after send to browser
    const accessToken = await jwt.sign(payload, publicKey, {
      expiresIn: "2 days",
    });

    const refreshToken = await jwt.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    jwt.verify(accessToken, publicKey, (err, decode) => {
        if (err) {
            console.error(`Error verify:`, err)
        } else {
            console.log(`Decode verify`, decode)
        }
    })

    return {accessToken, refreshToken};
  } catch (err) {}
};

export default createTokenPair;
