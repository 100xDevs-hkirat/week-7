"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const utilityControllers_1 = require("../controllers/utilityControllers");
exports.router = express_1.default.Router();
exports.router.route('/tokenValidator').get(utilityControllers_1.tokenValidator);
module.exports = {
    router: exports.router,
};
