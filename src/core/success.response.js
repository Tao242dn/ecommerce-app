'use strict';

import statusCodes from '../utils/statusCodes.js';
import reasonPhrases from '../utils/reasonPhrases.js';

class SuccessResponse {
  constructor({ message, statusCode = statusCodes.OK, reasonStatusCode = reasonPhrases.OK, metadata = {} }) {
    this.message = !message ? reasonStatusCode : message;
    this.status = statusCode;
    this.metadata = metadata;
  }

  send(res, headers = {}) {
    return res.status(this.status).json(this);
  }
}

class Ok extends SuccessResponse {
  constructor({ message, metadata }) {
    super({ message, metadata });
  }
}

class Created extends SuccessResponse {
  constructor({ message, statusCode = statusCodes.CREATED, reasonStatusCode = reasonPhrases.CREATED, metadata }) {
    super({ message, statusCode, reasonStatusCode, metadata });
  }
}

export { SuccessResponse, Ok, Created };
