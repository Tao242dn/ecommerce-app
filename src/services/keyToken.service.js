"use strict";

import keyTokenModel from "../models/keytoken.model.js";

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey }) => {
    try {
      const tokens = await keyTokenModel.create({
        user: userId,
        publicKey,
        privateKey,
      });

      return tokens ? tokens.publicKey : null;
    } catch (err) {
      return err;
    }
  };
}

export default KeyTokenService;
