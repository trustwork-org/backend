"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const schema = zod_1.z.object({
    PORT: zod_1.z.string().default('3001'),
    MONGODB_URI: zod_1.z.string().min(1),
    PRIVY_APP_ID: zod_1.z.string().min(1),
    SMTP_HOST: zod_1.z.string().min(1),
    SMTP_PORT: zod_1.z.string().default('587'),
    SMTP_USER: zod_1.z.string().email(),
    SMTP_PASS: zod_1.z.string().min(1),
});
const parsed = schema.safeParse(process.env);
if (!parsed.success) {
    console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
    process.exit(1);
}
exports.env = parsed.data;
