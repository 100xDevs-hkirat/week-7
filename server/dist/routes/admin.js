"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const adminControllers_1 = require("../controllers/adminControllers");
exports.router = express_1.default.Router();
exports.router.route("/me").get(adminControllers_1.adminDetails);
exports.router.route("/signup").post(adminControllers_1.registerAdmin);
exports.router.route("/login").post(adminControllers_1.adminLogin);
exports.router.route("/courses").post(adminControllers_1.createCourse).get(adminControllers_1.fetchAllCourse);
exports.router
    .route("/courses/:courseId")
    .put(adminControllers_1.updateCourse)
    .get(adminControllers_1.fetchSpecificCourse)
    .delete(adminControllers_1.deleteSpecificCourse);
module.exports = {
    router: exports.router,
};
