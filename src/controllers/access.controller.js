"use strict";

import AccessService from "../services/access.service.js";

class AccessController {
  signUp = async (req, res, next) => {
    return res.status(201).json(await AccessService.signup(req.body));
  };
}

export default new AccessController();
