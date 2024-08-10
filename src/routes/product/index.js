import express from 'express';
import productController from '../../controllers/product.controller.js';
import asyncHandler from '../../helpers/asyncHandler.js';
import { authentication } from '../../auth/authUtils.js';

const router = express.Router();

// search product
router.get('/search/:keySearch', asyncHandler(productController.getListSearchProduct));
router.get('', asyncHandler(productController.findAllProducts));
router.get('/:product_id', asyncHandler(productController.findProduct));

// authentication
router.use(authentication);

// create product
router.post('', asyncHandler(productController.createProduct));

// create publish product
router.post('/publish/:id', asyncHandler(productController.publishProductByShop));

// create draft product
router.post('/unpublish/:id', asyncHandler(productController.unPublishProductByShop));

// query drafts
router.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop));

// query publish
router.get('/published/all', asyncHandler(productController.getAllPublishForShop));

export default router;
