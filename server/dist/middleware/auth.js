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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticator_middleWare = exports.token_validator = exports.token_decrypter = exports.create_token = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = require("../db/index");
const SECRET = 'Test@12345_SECr3t';
const create_token = (payload) => {
    return jsonwebtoken_1.default.sign(payload, SECRET, { algorithm: 'HS256', expiresIn: "1h" });
};
exports.create_token = create_token;
const token_decrypter = (fieldName, token) => {
    const decodedToken = jsonwebtoken_1.default.verify(token, SECRET);
    if (decodedToken.hasOwnProperty(fieldName))
        return decodedToken[fieldName];
    else
        return null;
};
exports.token_decrypter = token_decrypter;
const token_validator = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let valid = false;
    let valid_account;
    if (!token)
        return valid;
    token = token.split(" ")[1];
    try {
        const username = (0, exports.token_decrypter)('username', token);
        const role = (0, exports.token_decrypter)('role', token);
        if (role === 'admin') {
            valid_account = yield index_1.Admin.findOne({ username });
        }
        else {
            valid_account = yield index_1.User.findOne({ username });
        }
        if (valid_account)
            valid = true;
    }
    catch (err) {
        return false;
    }
    return valid;
});
exports.token_validator = token_validator;
const authenticator_middleWare = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.url.includes('/signup') || req.url.includes('/login'))
        next();
    else {
        const authenticated = yield (0, exports.token_validator)(req.headers.authorization);
        authenticated ? next() : res.status(401).json({ message: "Access denied" });
    }
});
exports.authenticator_middleWare = authenticator_middleWare;
