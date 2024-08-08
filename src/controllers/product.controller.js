import { SuccessResponse } from '../core/success.response.js';
import ProductFactory from '../services/product.service.js';

class ProductController {
  createProduct = async (req, res, next) => {
    new SuccessResponse({
        message: 'Create new product successfully',
        metadata: await ProductFactory.createProduct(req.body.product_type, req.body)
    }).send(res)
  };
}

export default new ProductController();
