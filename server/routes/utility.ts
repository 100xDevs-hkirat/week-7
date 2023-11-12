import express from "express";
import { tokenValidator } from "../controllers/utilityControllers";

export const router = express.Router();

router.route('/tokenValidator').get(tokenValidator);

module.exports = {
    router,
  };