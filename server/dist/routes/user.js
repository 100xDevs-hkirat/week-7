"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const userControllers_1 = require("../controllers/userControllers");
exports.router = express_1.default.Router();
exports.router.route("/signup").post(userControllers_1.userRegistraton);
exports.router.route("/login").post(userControllers_1.userLogin);
exports.router.route("/courses").get(userControllers_1.fetchAllCourses);
exports.router.route("/courses/:courseId").post(userControllers_1.purchaseCourse);
exports.router.route("/purchasedCourses").get(userControllers_1.purchasedCourseList);
module.exports = {
    router: exports.router,
};
