"use strict";

import AccessService from "../services/access.service.js";
import { Created, SuccessResponse } from "../core/success.response.js";

class AccessController {
  login = async (req, res) => {
    new SuccessResponse({
      metadata: await AccessService.login(req.body),
    }).send(res);
  };

  signUp = async (req, res) => {
    new Created({
      message: "Registered Successfully!",
      metadata: await AccessService.signup(req.body),
    }).send(res);
  };

  logout = async (req, res) => {
    new SuccessResponse({
      message: "Logout Successfully!",
      metadata: await AccessService.logout({ keyStore: req.keyStore }),
    }).send(res);
  };
}

export default new AccessController();
