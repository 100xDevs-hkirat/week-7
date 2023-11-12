"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Course = exports.Admin = exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    username: { type: String },
    password: String,
    purchasedCourse: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Course' }]
});
const adminSchema = new mongoose_1.Schema({
    username: String,
    password: String
});
const courseSchema = new mongoose_1.Schema({
    title: String,
    description: String,
    price: Number,
    imageLink: String,
    published: Boolean
});
exports.User = (0, mongoose_1.model)('User', userSchema);
exports.Admin = (0, mongoose_1.model)('Admin', adminSchema);
exports.Course = (0, mongoose_1.model)('Course', courseSchema);
