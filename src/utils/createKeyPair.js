"use strict";

import crypto from "node:crypto";

const createKeyPair = () => {
  const publicKey = crypto.randomBytes(64).toString("hex");
  const privateKey = crypto.randomBytes(64).toString("hex");

  return {
    publicKey,
    privateKey,
  };
};

export default createKeyPair;
