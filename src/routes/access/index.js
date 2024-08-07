'use strict';

import express from 'express';
import accessController from '../../controllers/access.controller.js';
import asyncHandler from '../../helpers/asyncHandler.js';
import { authentication } from '../../auth/authUtils.js';

const router = express.Router();

// signUp
router.post('/shop/signup', asyncHandler(accessController.signUp));

// login
router.post('/shop/login', asyncHandler(accessController.login));

// authentication
router.use(authentication);

// logout
router.post('/shop/logout', asyncHandler(accessController.logout));

// handle refresh token
router.post('/shop/handleRefreshToken', asyncHandler(accessController.handleRefreshToken));

export default router;
