"use strict";

import AccessService from "../services/access.service.js";
import { Ok, Created } from "../core/success.response.js";

class AccessController {
  signUp = async (req, res) => {
    new Created({
      message: 'Registered successfully',
      metadata: await AccessService.signup(req.body)
    }).send(res)
  };
}

export default new AccessController();
