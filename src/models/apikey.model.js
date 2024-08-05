"use strict";

import { model, Schema } from "mongoose";

const COLLECTION_NAME = "ApiKeys";
const DOCUMENT_NAME = "ApiKey";

const apiKeySchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },

    status: {
      type: Boolean,
      default: true,
    },

    permission: {
      type: [String],
      required: true,
      default: ["0000", "1111", "2222"],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

export default model(DOCUMENT_NAME, apiKeySchema);
