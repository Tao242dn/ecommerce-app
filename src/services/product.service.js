'use strict';

import { BadRequestError } from '../core/error.response.js';
import modelSchema from '../models/product.model.js';
import {
  findAllDraftsForShop,
  findAllPublishForShop,
  publishProductByShop,
  searchProductByUser,
  unPublishProductByShop,
} from '../models/repositories/product.repo.js';

// Define Factory class to create product
class ProductFactory {
  /**
   * type - 'Electronic', 'Clothing'
   * payload
   */

  // * Implement don't use Design Pattern (Strategies Pattern) */
  // static async createProduct(type, payload) {
  //   switch (type) {
  //     case 'Electronic':
  //       return new Electronic(payload).createProduct();
  //     case 'Clothing':
  //       return new Clothing(payload).createProduct();
  //     default:
  //       throw new BadRequestError(`Invalid product type: ${type}`);
  //   }
  // }

  // Use Design Pattern Factory Pattern and Strategies Pattern
  static productRegistry = {}; // key - class

  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) throw new BadRequestError(`Invalid product type: ${type}`);

    return new productClass(payload).createProduct();
  }

  // publish product
  static async publishProductByShop({ product_id, product_shop }) {
    return await publishProductByShop({ product_id, product_shop });
  }

  // unpublish product
  static async unPublishProductByShop({ product_id, product_shop }) {
    return await unPublishProductByShop({ product_id, product_shop });
  }

  // query draft
  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = {
      product_shop,
      isDraft: true,
    };
    return await findAllDraftsForShop({ query, limit, skip });
  }

  // query publish
  static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = {
      product_shop,
      isPublish: true,
    };
    return await findAllPublishForShop({ query, limit, skip });
  }

  static async searchProduct({ keySearch }) {
    return await searchProductByUser({ keySearch });
  }
}

// Define base product class
class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  // create new product
  async createProduct(product_id) {
    return await modelSchema.productModel.create({ ...this, _id: product_id });
  }
}

// Define sub-class for different product types Clothing
class Clothing extends Product {
  async createProduct() {
    const newClothing = await modelSchema.clothingModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) throw new BadRequestError('Create new clothes failed');

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequestError('Create a new product failed');

    return newProduct;
  }
}

// Define sub-class for different product types Electronic
class Electronic extends Product {
  async createProduct() {
    const newElectronic = await modelSchema.electronicModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic) throw new BadRequestError('Create a new electronic failed');

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequestError('Create a new product failed');

    return newProduct;
  }
}

class Furniture extends Product {
  async createProduct() {
    const newFurniture = await modelSchema.furnitureModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurniture) throw new BadRequestError('Create a new furniture failed');

    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) throw new BadRequestError('Create a new product failed');

    return newProduct;
  }
}

// register product type
ProductFactory.registerProductType('Clothing', Clothing);
ProductFactory.registerProductType('Electronic', Electronic);
ProductFactory.registerProductType('Furniture', Furniture);

export default ProductFactory;
