'use strict';

import { model, Schema } from 'mongoose';

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

const productSchema = new Schema(
  {
    product_name: {
      type: String,
      required: true,
    },

    product_thumb: {
      type: String,
      required: true,
    },

    product_description: String,

    product_price: {
      type: Number,
      required: true,
    },

    product_quantity: {
      type: Number,
      required: true,
    },

    product_type: {
      type: String,
      required: true,
      enum: ['Electronic', 'Clothing', 'Furniture'],
    },

    product_shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
    },

    product_attributes: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

// Define the Clothing schema
const clothingSchema = new Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    size: String,
    material: String,
  },
  {
    collection: 'Clothes',
    timestamps: true,
  }
);

// Define the Electronic schema
const electronicSchema = new Schema(
  {
    manufacturer: {
      type: String,
      required: true,
    },
    model: String,
    color: String,
  },
  {
    collection: 'Electronics',
    timestamps: true,
  }
);

// Define the Furniture schema
const furnitureSchema = new Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    size: String,
    material: String,
  },
  {
    collection: 'furnitures',
    timestamps: true,
  }
);

export default {
    productModel: model(DOCUMENT_NAME, productSchema),
    electronicModel: model('Electronic', electronicSchema),
    clothingModel: model('Clothing', clothingSchema),
}