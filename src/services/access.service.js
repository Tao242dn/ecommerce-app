"use strict";

import shopModel from "../models/shop.model.js";
import keyTokenModel from "../models/keytoken.model.js";
import bcrypt from "bcrypt";
import KeyTokenService from "./keyToken.service.js";
import { createTokenPair, verifyJwt } from "../auth/authUtils.js";
import { getInfoData } from "../utils/index.js";
import {
  AuthFailureError,
  BadRequestError,
  ForBiddenError,
} from "../core/error.response.js";
import findByEmail from "./shop.service.js";
import createKeyPair from "../utils/createKeyPair.js";

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  // Check refresh token already used
  static handleRefreshToken = async ({ refreshToken }) => {
    const foundToken = await KeyTokenService.findByRefreshTokensUsed(
      refreshToken
    );
    if (foundToken) {
      // Decode who are you
      const { userId, email, password } = verifyJwt(
        refreshToken,
        foundToken.privateKey
      );
      console.log({ userId, email, password });
      // Delete all token in keystore
      await KeyTokenService.deleteKeyById(userId);
      throw new ForBiddenError("Something wrong happened please try again");
    }

    // No it awesome
    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
    if (!holderToken) throw new AuthFailureError("Shop not registered");

    // If find verify token
    const { userId, email, password } = verifyJwt(
      refreshToken,
      holderToken.privateKey
    );
    console.log("[2]---", { userId, email, password });

    // Check UserId
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new AuthFailureError("Shop not registered");

    // Create new one pair token
    const tokens = createTokenPair(
      { userId, email, password },
      holderToken.publicKey,
      holderToken.privateKey
    );
   
    // Update refresh token and refresh token used 
    await keyTokenModel.findOneAndUpdate(
      { user: foundShop._id },
      {
        $set: { refreshToken: tokens.refreshToken },
        $addToSet: { refreshTokensUsed: refreshToken },
      },
    );

    return {
      user: { userId, email, password },
      tokens,
    };
  };

  static logout = async ({ keyStore }) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    console.log(delKey);
    return delKey;
  };

  static login = async ({ email, password, refreshToken = null }) => {
    // 1. check email in dbs
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new BadRequestError("Shop not registered!");

    // 2. match password
    const match = bcrypt.compare(password, foundShop.password);
    if (!match) throw new AuthFailureError("Authentication error");

    // 3. create private/public key
    const { publicKey, privateKey } = createKeyPair();

    const { _id: userId } = foundShop;

    // 4. generate token
    const tokens = createTokenPair(
      { userId, email, password },
      publicKey,
      privateKey
    );

    // 5. Save toke in db
    await KeyTokenService.createKeyToken({
      userId,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });

    // 6. get data from login
    return {
      shop: getInfoData({
        fields: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
  };

  static signup = async ({ name, email, password }) => {
    // Check email exits ?
    const shop = await shopModel.findOne({ email }).lean();

    if (shop) throw new BadRequestError("Error: Shop already registered!");

    const passwordHash = await bcrypt.hash(password, 10);

    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });

    // created private key, (send user sign token) public key (save in system verify token)
    // const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    //   modulusLength: 4096,
    //   publicKeyEncoding: {
    //     type: "pkcs1",
    //     format: "pem",
    //   },
    //   privateKeyEncoding: {
    //     type: "pkcs1",
    //     format: "pem",
    //   },
    // });

    return {
      shop: getInfoData({
        fields: ["_id", "name", "email"],
        object: newShop,
      }),
    };
  };
}

export default AccessService;
