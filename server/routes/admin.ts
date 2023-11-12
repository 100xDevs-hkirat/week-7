import express from "express";

import {
  adminDetails,
  adminLogin,
  createCourse,
  deleteSpecificCourse,
  fetchAllCourse,
  fetchSpecificCourse,
  registerAdmin,
  updateCourse,
} from "../controllers/adminControllers";

export const router = express.Router();

router.route("/me").get(adminDetails);
router.route("/signup").post(registerAdmin);
router.route("/login").post(adminLogin);
router.route("/courses").post(createCourse).get(fetchAllCourse);
router
  .route("/courses/:courseId")
  .put(updateCourse)
  .get(fetchSpecificCourse)
  .delete(deleteSpecificCourse);

module.exports = {
  router,
};
