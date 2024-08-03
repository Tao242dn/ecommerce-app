"use strict";

import shopModel from "../models/shop.model";
import bcrypt from "bcrypt";
import crypto from "node:crypto";

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static signup = async ({ name, email, password }) => {
    try {
      // Step 1: Check email exits ?
      const shop = await shopModel.findOne({ email }).lean();
      if (shop) {
        return {
          code: "xxxx",
          message: "Shop already registered",
        };
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const newShop = await shopModel.create({
        name,
        email,
        password: passwordHash,
        roles: [RoleShop.SHOP],
      });

      if (newShop) {
        // created private key, (send user sign token) public key (save in system verify token)
        const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
          modulusLength: 4096,
        });

        console.log({privateKey, publicKey}); // save collection KeyStore
      }
    } catch (err) {
      return {
        code: "xxx",
        message: err.message,
        status: "error",
      };
    }
  };
}

export default AccessService;
