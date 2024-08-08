import express from 'express';
import productController from '../../controllers/product.controller.js';
import asyncHandler from '../../helpers/asyncHandler.js';
import { authentication } from '../../auth/authUtils.js';

const router = express.Router();

// authentication
router.use(authentication);

router.post('', asyncHandler(productController.createProduct));

export default router;
