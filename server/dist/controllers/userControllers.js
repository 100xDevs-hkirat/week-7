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
exports.purchasedCourseList = exports.purchaseCourse = exports.fetchAllCourses = exports.userLogin = exports.userRegistraton = void 0;
const auth_1 = require("../middleware/auth");
const schema_interfaces_1 = require("../utilities/schema_interfaces");
const db_1 = require("../db");
const userRegistraton = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsedInput = schema_interfaces_1.access_request_validator.safeParse(req.body);
        if (!parsedInput.success) {
            res.status(411).json({ message: "Invalid input", "Error": parsedInput.error });
            return;
        }
        const payload = parsedInput.data;
        const existing_account = yield db_1.User.findOne({ username: payload.username });
        existing_account && res.status(403).json({ message: 'username already exists. Please use another one!' });
        if (!existing_account) {
            const new_account = new db_1.User(payload);
            yield new_account.save();
            res.status(201).json({ message: 'User created successfully', token: (0, auth_1.create_token)(req.body) });
        }
    }
    catch (err) {
        res.status(503).json({ message: 'Something went wrong', error: err });
    }
});
exports.userRegistraton = userRegistraton;
const userLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.headers;
    const valid__credentials = yield db_1.User.findOne({ username, password });
    valid__credentials ? res.status(200).send({ message: 'Logged in successfully', token: (0, auth_1.create_token)({ username, role: 'user' }) }) :
        res.status(401).json({ message: "Invalid username or password" });
});
exports.userLogin = userLogin;
const fetchAllCourses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json({ courses: yield db_1.Course.find({ published: true }) });
});
exports.fetchAllCourses = fetchAllCourses;
const purchaseCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const purchasedCourseId = req.params["courseId"];
    if (req.headers.authorization) {
        const username = (0, auth_1.token_decrypter)('username', req.headers.authorization.split(' ')[1]);
        const course = yield db_1.Course.findById(purchasedCourseId);
        if (course) {
            const loggedInUser = yield db_1.User.findOne({ username });
            if (loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.purchasedCourse.map((id) => id.toString()).includes(purchasedCourseId)) {
                res.status(403).json({ message: "You've already purchased this course. No need to buy it again." });
            }
            else {
                loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.purchasedCourse.push(course);
                yield (loggedInUser === null || loggedInUser === void 0 ? void 0 : loggedInUser.save());
                res.status(200).json({ message: 'Course purchased successfully' });
            }
        }
        else {
            res.status(403).json({ message: 'Invalid course id' });
        }
    }
    else {
        res.status(401).json({ message: "Unauthorized" });
    }
});
exports.purchaseCourse = purchaseCourse;
const purchasedCourseList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.headers.authorization) {
        const username = (0, auth_1.token_decrypter)('username', req.headers.authorization.split(' ')[1]);
        const loggedInUser = yield db_1.User.findOne({ username }).populate('purchasedCourse');
        loggedInUser ? res.status(200).json({ purchasedCourses: loggedInUser.purchasedCourse || [] }) :
            res.status(403).json({ message: 'User not found' });
    }
    else {
        res.status(401).json({ message: "Unauthorized" });
    }
});
exports.purchasedCourseList = purchasedCourseList;
