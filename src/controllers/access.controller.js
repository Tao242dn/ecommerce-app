"use strict";

import AccessService from "../services/access.service.js";
import { Created, SuccessResponse } from "../core/success.response.js";

class AccessController {
  handleRefreshToken = async (req, res) => {
    new SuccessResponse({
      message: "Get tokens successfully",
      metadata: await AccessService.handleRefreshToken({
        refreshToken: req.body.refreshToken,
      }),
    }).send(res);
  };

  login = async (req, res) => {
    new SuccessResponse({
      metadata: await AccessService.login(req.body),
    }).send(res);
  };

  signUp = async (req, res) => {
    new Created({
      message: "Registered successfully",
      metadata: await AccessService.signup(req.body),
    }).send(res);
  };

  logout = async (req, res) => {
    new SuccessResponse({
      message: "Logout Successfully",
      metadata: await AccessService.logout({ keyStore: req.keyStore }),
    }).send(res);
  };
}

export default new AccessController();
