"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminDetails = exports.deleteSpecificCourse = exports.fetchAllCourse = exports.fetchSpecificCourse = exports.updateCourse = exports.createCourse = exports.adminLogin = exports.registerAdmin = void 0;
const db_1 = require("../db");
const auth_1 = require("../middleware/auth");
const schema_interfaces_1 = require("../utilities/schema_interfaces");
const registerAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsedInput = schema_interfaces_1.access_request_validator.safeParse(req.body);
        if (!parsedInput.success) {
            res.status(411).json({ message: "Invalid input", "Error": parsedInput.error });
            return;
        }
        const payload = parsedInput.data;
        const username = payload.username;
        const existing_account = yield db_1.Admin.findOne({
            username,
        });
        existing_account &&
            res
                .status(403)
                .json({ message: "username already exists. Please use another one!" });
        if (!existing_account) {
            const new_account = new db_1.Admin(payload);
            yield new_account.save();
            res
                .status(201)
                .json({
                message: "Admin created successfully",
                token: (0, auth_1.create_token)(req.body),
            });
        }
    }
    catch (err) {
        res.status(503).json({ message: "Something went wrong", error: err });
    }
});
exports.registerAdmin = registerAdmin;
const adminLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.headers;
    const parsedInput = schema_interfaces_1.access_request_validator.safeParse({ username, password });
    if (!parsedInput.success) {
        res.status(411).json({ message: "Invalid input for username/password", "Error": parsedInput.error });
        return;
    }
    const valid__credentials = yield db_1.Admin.findOne({
        username,
        password,
    });
    valid__credentials &&
        res
            .status(200)
            .send({
            message: "Logged in successfully",
            token: (0, auth_1.create_token)({ username, role: "admin" }),
        });
    !valid__credentials &&
        res.status(401).json({ message: "Invalid username or password" });
});
exports.adminLogin = adminLogin;
const createCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedInput = schema_interfaces_1.create_course_validator.safeParse(req.body);
    if (!parsedInput.success) {
        res.status(411).json({ message: "Invalid input for course fields", error: parsedInput.error });
        return;
    }
    const new_course = new db_1.Course(parsedInput.data);
    yield new_course.save();
    res
        .status(200)
        .json({ message: "Course created successfully", courseId: new_course.id });
});
exports.createCourse = createCourse;
const updateCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courseId = req.params["courseId"];
        let course_found = yield db_1.Course.findByIdAndUpdate(courseId, req.body, { new: true });
        course_found
            ? res.status(200).json({ message: "Course updatd successfully" })
            : res
                .status(404)
                .json({ message: "Invalid course id. Course not found" });
    }
    catch (err) {
        res.status(404).json({ message: "Invalid course id. Course not found" });
    }
});
exports.updateCourse = updateCourse;
const fetchSpecificCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courseId = req.params["courseId"];
        let course_found = yield db_1.Course.findById(courseId);
        course_found
            ? res.status(200).json(course_found)
            : res
                .status(404)
                .json({ message: "Invalid course id. Course not found" });
    }
    catch (err) {
        res.status(404).json({ message: "Invalid course id. Course not found" });
    }
});
exports.fetchSpecificCourse = fetchSpecificCourse;
const fetchAllCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json({ courses: yield db_1.Course.find({}) });
});
exports.fetchAllCourse = fetchAllCourse;
const deleteSpecificCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courseId = req.params["courseId"];
        if (yield db_1.Course.findById(courseId)) {
            let course_found = yield db_1.Course.findByIdAndDelete(courseId);
            course_found &&
                res.status(200).json({ message: "Course deleted successfully" });
        }
        else {
            res.status(404).json({ message: "Invalid course id. Course not found" });
        }
    }
    catch (err) {
        res.status(404).json({ message: "Invalid course id. Course not found" });
    }
});
exports.deleteSpecificCourse = deleteSpecificCourse;
const adminDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (req.headers.authorization) {
        const USERNAME = yield (0, auth_1.token_decrypter)('username', (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]);
        USERNAME ? res.status(200).json({ username: USERNAME })
            : res.status(403).json({ message: `Admin doesn't exist` });
    }
    else {
        res.status(401).json({ message: "Unauthorized" });
    }
});
exports.adminDetails = adminDetails;
