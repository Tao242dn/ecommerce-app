'use strict';

import apiKeyModel from '../models/apikey.model.js';
import crypto from 'node:crypto';

const findById = async (key) => {
  //   const newKey = await apiKeyModel.create({
  //     key: crypto.randomBytes(64).toString("hex"),
  //     permissions: ["0000"],
  //   });

  //   console.log(newKey);
  return await apiKeyModel.findOne({ key, status: true }).lean();
};

export default findById;
