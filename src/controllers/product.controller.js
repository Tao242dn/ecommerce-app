import { SuccessResponse } from '../core/success.response.js';
import ProductFactory from '../services/product.service.js';

class ProductController {
  // create product
  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Create new product successfully',
      metadata: await ProductFactory.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  // publish product
  publishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Publish product successfully',
      metadata: await ProductFactory.publishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  // unpublish product
  unPublishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Unpublish product successfully',
      metadata: await ProductFactory.unPublishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  // Get all draft product
  getAllDraftsForShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list draft successfully',
      metadata: await ProductFactory.findAllDraftsForShop({ product_shop: req.user.userId }),
    }).send(res);
  };

  // Get all publish product
  getAllPublishForShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list publish successfully',
      metadata: await ProductFactory.findAllPublishForShop({ product_shop: req.user.userId }),
    }).send(res);
  };

  // get list search product
  getListSearchProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list search successfully',
      metadata: await ProductFactory.searchProducts({ keySearch: req.params.keySearch }),
    }).send(res);
  };

  // get all products
  findAllProducts = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list all products successfully',
      metadata: await ProductFactory.findAllProducts(req.query)
    }).send(res)
  }

  // get one product
  findProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get one product successfully',
      metadata: await ProductFactory.findProduct({ product_id: req.params.product_id })
    }).send(res)
  }
}

export default new ProductController();
