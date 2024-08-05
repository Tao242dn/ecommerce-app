"use strict";

import express from "express";
import accessController from "../../controllers/access.controller.js";

const router = express.Router();

const handlerSignUpError = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    }
}

// signUp
router.post("/shop/signup", handlerSignUpError(accessController.signUp));

export default router;
