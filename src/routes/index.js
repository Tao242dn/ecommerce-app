"use strict";

import express from "express";
import accessRouter from "./access/index.js";
import { checkApiKey, checkPermission } from "../auth/checkAuth.js";

const router = express.Router();

// check api key
router.use(checkApiKey);

// check permission
router.use(checkPermission('0000'));

router.use("/v1/api", accessRouter);

export default router;
