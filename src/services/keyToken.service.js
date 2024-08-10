'use strict';

import keyTokenModel from '../models/keytoken.model.js';

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
    const filter = { user: userId };
    const update = {
      publicKey,
      privateKey,
      refreshTokensUsed: [],
      refreshToken,
    };
    const options = { upsert: true, new: true };

    return await keyTokenModel.findOneAndUpdate(filter, update, options);
  };

  static findByUserId = async (userId) => {
    return await keyTokenModel.findOne({ user: userId }).lean();
  };

  static removeKeyById = async (keyId) => {
    return await keyTokenModel.deleteOne({ _id: keyId });
  };

  static deleteKeyById = async (userId) => {
    return await keyTokenModel.deleteOne({ user: userId });
  };

  static findByRefreshTokensUsed = async (refreshTokenUsed) => {
    return await keyTokenModel.findOne({ refreshTokensUsed: refreshTokenUsed }).lean();
  };

  static findByRefreshToken = async (refreshTokenUsed) => {
    return await keyTokenModel.findOne({ refreshToken: refreshTokenUsed }).lean();
  };
}

export default KeyTokenService;
