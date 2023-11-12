"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create_course_validator = exports.access_request_validator = void 0;
const zod_1 = require("zod");
exports.access_request_validator = zod_1.z.object({
    username: zod_1.z.string().min(3).max(20),
    password: zod_1.z.string().min(8).max(30)
});
exports.create_course_validator = zod_1.z.object({
    title: zod_1.z.string().min(5).max(150),
    description: zod_1.z.string().min(1).max(500),
    price: zod_1.z.number().lt(9999),
    imageLink: zod_1.z.string().max(200),
    published: zod_1.z.boolean().default(false)
});
