import express from "express";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/authorize.middleware.js";

const router = express.Router();

router.get("/test",authenticate,authorize("ADMIN"),(req, res) => {res.status(200).json({
      message: "Welcome Admin",
    });
  }
);

export default router;