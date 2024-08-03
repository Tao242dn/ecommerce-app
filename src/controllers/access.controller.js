"use strict";

class AccessController {
  signUp = async (req, res, next) => {
    try {
      console.log(`[P]::signUp::`, req.body);
      // 200 0k, 201 CREATED
      return res.status(201).json({
        code: "20001", // we defined
        metadata: { user_id: 1 },
      });
    } catch (err) {
      next(err);
    }
  };
}

export default new AccessController();
