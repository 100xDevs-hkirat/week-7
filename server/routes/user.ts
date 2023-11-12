import express from "express";
import {
  fetchAllCourses,
  purchaseCourse,
  purchasedCourseList,
  userLogin,
  userRegistraton,
} from "../controllers/userControllers";

export const router = express.Router();

router.route("/signup").post(userRegistraton);
router.route("/login").post(userLogin);
router.route("/courses").get(fetchAllCourses);
router.route("/courses/:courseId").post(purchaseCourse);
router.route("/purchasedCourses").get(purchasedCourseList);

module.exports = {
  router,
};
