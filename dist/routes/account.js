"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const accountController_1 = require("../controllers/accountController");
const validate_1 = require("../middleware/validate");
const zod_1 = require("zod");
const registerSchema = zod_1.z.object({
    walletAddress: zod_1.z.string().regex(/^0x[0-9a-fA-F]{40}$/),
    email: zod_1.z.string().email(),
});
const router = (0, express_1.Router)();
router.post('/register', (0, validate_1.validate)(registerSchema), accountController_1.registerAccount);
exports.default = router;
