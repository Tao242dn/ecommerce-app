'use strict';

import { model, Schema } from 'mongoose';
import slugify from 'slugify'

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

const productSchema = new Schema(
  {
    product_name: {
      // Eg: Iphone 14 Pro Max
      type: String,
      required: true,
    },

    product_thumb: {
      type: String,
      required: true,
    },

    product_description: String,
    product_slug: String, // Eg: Iphone-14-ProMax

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
    // more attribute
    product_ratingAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      // 4.33345666 => 4.3
      set: (val) => Math.round(val * 10) / 10,
    },
    product_variations: {
      type: Array,
      default: [],
    },
    isDraft: {
      type: Boolean,
      default: true,
      index: true,
      select: false,
    },
    isPublish: {
      type: Boolean,
      default: false,
      index: true,
      select: false,
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

// create index for search product_name and product_description
productSchema.index({
  product_name: 'text',
  product_description: 'text'
})

// Document middleware: runs before .save() and .create()
productSchema.pre('save', function (next) {
  this.product_slug = slugify(this.product_name, { lower: true });
  next();
});

// Define the Clothing schema
const clothingSchema = new Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    size: String,
    material: String,
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
    },
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
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
    },
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
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
    },
  },
  {
    collection: 'Furnitures',
    timestamps: true,
  }
);

export default {
  productModel: model(DOCUMENT_NAME, productSchema),
  electronicModel: model('Electronic', electronicSchema),
  clothingModel: model('Clothing', clothingSchema),
  furnitureModel: model('Furniture', furnitureSchema),
};
