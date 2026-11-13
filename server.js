
"use strict";

/* ==========================================
   CODE NEXA FORGE — MAIN SERVER
========================================== */

require("dotenv").config();

const express = require("express");
const path = require("path");
const fs = require("fs");
const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session);
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

/* ==========================================
   PROJECT MODULES
========================================== */

const db = require("./database/database");
const quizBank = require("./database/quiz-bank");
const createLibraryRouter = require("./routes/library");
const NexaEngine = require("./nexa/nexa-engine");

/* ==========================================
   SERVER CONFIGURATION
========================================== */

const app = express();

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "0.0.0.0";

const SESSION_SECRET = process.env.SESSION_SECRET;
const SESSION_DIR = process.env.CNF_SESSION_DIR
    ? path.resolve(process.env.CNF_SESSION_DIR)
    : path.join(__dirname, "database");

fs.mkdirSync(SESSION_DIR, { recursive: true });

if (!SESSION_SECRET) {
    throw new Error("SESSION_SECRET is missing from .env");
}

if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
}

app.disable("x-powered-by");

/* ==========================================
   NEXA AI — INDEPENDENT LOCAL ENGINE
========================================== */

const nexaEngine = new NexaEngine();

console.log("NEXA AI: INDEPENDENT LOCAL ENGINE READY");

/* ==========================================
   EMAIL CONFIGURATION
========================================== */

const GMAIL_USER = process.env.GMAIL_USER;

const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD
    ? process.env.GMAIL_APP_PASSWORD.replace(/\s/g, "")
    : "";

let transporter = null;

if (GMAIL_USER && GMAIL_APP_PASSWORD) {

    transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: GMAIL_USER,
            pass: GMAIL_APP_PASSWORD
        }
    });

    console.log("GMAIL OTP SERVICE CONFIGURED");

} else {

    console.warn("GMAIL OTP SERVICE NOT CONFIGURED");

}

/* ==========================================
   OTP SETTINGS
========================================== */

const OTP_EXPIRY_MS = 10 * 60 * 1000;
const OTP_RESEND_COOLDOWN_MS = 60 * 1000;
const OTP_MAX_ATTEMPTS = 5;

const RESET_TOKEN_EXPIRY_MS = 10 * 60 * 1000;

/* ==========================================
   MIDDLEWARE
========================================== */

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.use((req, res, next) => {

    console.log(
        `${new Date().toISOString()} | ${req.method} ${req.url}`
    );

    next();

});

/* ==========================================
   SESSION CONFIGURATION
========================================== */

app.use(session({

    name: "cnf.sid",

    secret: SESSION_SECRET,

    resave: false,

    saveUninitialized: false,

    store: new SQLiteStore({

        db: "sessions.sqlite",

        dir: SESSION_DIR,

        table: "sessions"

    }),

    cookie: {

        httpOnly: true,

        secure: process.env.NODE_ENV === "production",

        sameSite: "lax",

        maxAge: 7 * 24 * 60 * 60 * 1000

    }

}));

/* ==========================================
   STATIC WEBSITE
========================================== */

const PUBLIC_DIR = path.join(__dirname, "public");

app.use(express.static(PUBLIC_DIR));

/* ==========================================
   HELPER FUNCTIONS
========================================== */

function sendError(res, status, message) {

    return res.status(status).json({

        success: false,

        message

    });

}

function validEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

}

function requireLogin(req, res, next) {

    if (!req.session.userId) {

        return sendError(
            res,
            401,
            "Please log in to continue."
        );

    }

    next();

}

function getUserByEmail(email) {

    return new Promise((resolve, reject) => {

        db.get(
            "SELECT * FROM users WHERE email = ? COLLATE NOCASE",
            [email],
            (error, user) => {

                if (error) return reject(error);

                resolve(user);

            }
        );

    });

}

function createUser(name, email, password) {

    return new Promise((resolve, reject) => {

        db.run(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",

            [name, email, password],

            function (error) {

                if (error) return reject(error);

                resolve(this.lastID);

            }
        );

    });

}

function dbGet(sql, params = []) {

    return new Promise((resolve, reject) => {

        db.get(sql, params, (error, row) => {

            if (error) return reject(error);

            resolve(row);

        });

    });

}

function dbAll(sql, params = []) {

    return new Promise((resolve, reject) => {

        db.all(sql, params, (error, rows) => {

            if (error) return reject(error);

            resolve(rows);

        });

    });

}

function dbRun(sql, params = []) {

    return new Promise((resolve, reject) => {

        db.run(sql, params, function (error) {

            if (error) return reject(error);

            resolve({

                lastID: this.lastID,

                changes: this.changes

            });

        });

    });

}

function hashValue(value) {

    return crypto
        .createHmac("sha256", SESSION_SECRET)
        .update(value)
        .digest("hex");

}

function safeHashCompare(first, second) {

    if (
        typeof first !== "string" ||
        typeof second !== "string" ||
        first.length !== second.length ||
        !/^[a-f0-9]+$/i.test(first) ||
        !/^[a-f0-9]+$/i.test(second)
    ) {

        return false;

    }

    return crypto.timingSafeEqual(
        Buffer.from(first, "hex"),
        Buffer.from(second, "hex")
    );

}

/* ==========================================
   PUBLIC USER DATA
========================================== */

function getPublicUser(user) {

    return {

        id: user.id,

        name: user.name,

        email: user.email,

        role: user.role || "student",

        createdAt: user.created_at

    };

}

/* ==========================================
   NEXA LIBRARY API
========================================== */

app.use(
    "/api/library",
    createLibraryRouter({
        db,
        requireLogin
    })
);

/* ==========================================
   QUIZ SYSTEM — GET QUIZ
========================================== */

app.get(
    "/api/quizzes/:quizId",
    requireLogin,
    (req, res) => {

        try {

            const quiz = quizBank.getPublicQuiz(
                req.params.quizId
            );

            if (!quiz) {

                return sendError(
                    res,
                    404,
                    "Quiz not found."
                );

            }

            return res.json({

                success: true,

                quiz

            });

        } catch (error) {

            console.error("GET QUIZ ERROR:", error);

            return sendError(
                res,
                500,
                "Unable to load this quiz."
            );

        }

    }
);

/* ==========================================
   QUIZ SYSTEM — SUBMIT QUIZ
========================================== */

app.post(
    "/api/quizzes/:quizId/submit",
    requireLogin,
    async (req, res, next) => {

        let result;

        try {

            const answers = req.body?.answers;

            if (!Array.isArray(answers)) {

                return sendError(
                    res,
                    400,
                    "Please submit a valid answer list."
                );

            }

            if (answers.length > 100) {

                return sendError(
                    res,
                    400,
                    "Invalid quiz submission."
                );

            }

            result = quizBank.calculateQuizResult(
                req.params.quizId,
                answers
            );

        } catch (error) {

            return sendError(
                res,
                400,
                error.message || "Invalid quiz submission."
            );

        }

        try {

            const userId = req.session.userId;

            await dbRun(
                `
                INSERT INTO quiz_results (
                    user_id,
                    quiz_id,
                    course_name,
                    quiz_title,
                    score,
                    total_questions,
                    percentage,
                    passed
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `,
                [
                    userId,
                    result.quizId,
                    result.course,
                    result.title,
                    result.score,
                    result.totalQuestions,
                    result.percentage,
                    result.passed ? 1 : 0
                ]
            );

            return res.json({

                success: true,

                message: "Your quiz result has been saved.",

                result

            });

        } catch (error) {

            next(error);

        }

    }
);

/* ==========================================
   QUIZ SYSTEM — STUDENT RESULTS
========================================== */

app.get(
    "/api/quiz-results",
    requireLogin,
    async (req, res, next) => {

        try {

            const results = await dbAll(
                `
                SELECT
                    id,
                    quiz_id AS quizId,
                    course_name AS course,
                    quiz_title AS title,
                    score,
                    total_questions AS totalQuestions,
                    percentage,
                    passed,
                    submitted_at AS submittedAt
                FROM quiz_results
                WHERE user_id = ?
                ORDER BY submitted_at DESC, id DESC
                `,
                [req.session.userId]
            );

            return res.json({

                success: true,

                results

            });

        } catch (error) {

            next(error);

        }

    }
);

/* ==========================================
   BASIC TEST ROUTES
========================================== */

app.get("/test", (req, res) => {

    res.status(200).send(
        "CODE NEXA FORGE SERVER IS WORKING"
    );

});

app.get("/api/health", (req, res) => {

    res.json({

        success: true,

        status: "running",

        application: "CODE NEXA FORGE",

        timestamp: new Date().toISOString()

    });

});

/* ==========================================
   SIGNUP API
========================================== */

app.post("/api/auth/signup", async (req, res, next) => {

    try {

        const { name, email, password } = req.body || {};

        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string"
        ) {

            return sendError(
                res,
                400,
                "Please provide all required fields."
            );

        }

        const cleanName = name.trim();

        const cleanEmail = email.trim().toLowerCase();

        if (cleanName.length < 2 || cleanName.length > 80) {

            return sendError(
                res,
                400,
                "Name must be between 2 and 80 characters."
            );

        }

        if (!validEmail(cleanEmail) || cleanEmail.length > 254) {

            return sendError(
                res,
                400,
                "Please enter a valid email address."
            );

        }

        if (
            password.length < 8 ||
            Buffer.byteLength(password, "utf8") > 72
        ) {

            return sendError(
                res,
                400,
                "Password must be at least 8 characters and no more than 72 bytes."
            );

        }

        const existingUser = await getUserByEmail(cleanEmail);

        if (existingUser) {

            return sendError(
                res,
                409,
                "An account with this email already exists."
            );

        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const userId = await createUser(
            cleanName,
            cleanEmail,
            hashedPassword
        );

        const newUser = await dbGet(
            `
            SELECT id, name, email, role, created_at
            FROM users
            WHERE id = ?
            `,
            [userId]
        );

        req.session.regenerate(error => {

            if (error) return next(error);

            req.session.userId = userId;

            req.session.save(saveError => {

                if (saveError) return next(saveError);

                return res.status(201).json({

                    success: true,

                    message: "Your account has been created successfully.",

                    user: getPublicUser(newUser)

                });

            });

        });

    } catch (error) {

        if (error.code === "SQLITE_CONSTRAINT") {

            return sendError(
                res,
                409,
                "This email is already registered."
            );

        }

        next(error);

    }

});

/* ==========================================
   LOGIN API
========================================== */

app.post("/api/auth/login", async (req, res, next) => {

    try {

        const { email, password } = req.body || {};

        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password
        ) {

            return sendError(
                res,
                400,
                "Email and password are required."
            );

        }

        const cleanEmail = email.trim().toLowerCase();

        if (!validEmail(cleanEmail) || cleanEmail.length > 254) {

            return sendError(
                res,
                400,
                "Please enter a valid email address."
            );

        }

        if (Buffer.byteLength(password, "utf8") > 72) {

            return sendError(
                res,
                401,
                "Invalid email or password."
            );

        }

        const user = await getUserByEmail(cleanEmail);

        if (!user) {

            return sendError(
                res,
                401,
                "Invalid email or password."
            );

        }

        const passwordMatches = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatches) {

            return sendError(
                res,
                401,
                "Invalid email or password."
            );

        }

        req.session.regenerate(error => {

            if (error) return next(error);

            req.session.userId = user.id;

            req.session.save(saveError => {

                if (saveError) return next(saveError);

                return res.json({

                    success: true,

                    message: "Login successful.",

                    user: getPublicUser(user)

                });

            });

        });

    } catch (error) {

        next(error);

    }

});

/* ==========================================
   CURRENT USER API
========================================== */

app.get("/api/auth/me", (req, res, next) => {

    if (!req.session.userId) {

        return sendError(
            res,
            401,
            "You are not logged in."
        );

    }

    db.get(
        `
        SELECT id, name, email, role, created_at
        FROM users
        WHERE id = ?
        `,
        [req.session.userId],
        (error, user) => {

            if (error) return next(error);

            if (!user) {

                return sendError(
                    res,
                    401,
                    "Account not found."
                );

            }

            return res.json({

                success: true,

                user: getPublicUser(user)

            });

        }
    );

});

/* ==========================================
   FORGOT PASSWORD — SEND OTP
========================================== */

app.post(
    "/api/auth/forgot-password",
    async (req, res, next) => {

        try {

            const { email } = req.body || {};

            if (
                typeof email !== "string" ||
                !validEmail(email.trim()) ||
                email.trim().length > 254
            ) {

                return sendError(
                    res,
                    400,
                    "Please enter a valid email address."
                );

            }

            if (!transporter) {

                return sendError(
                    res,
                    503,
                    "Email service is not configured."
                );

            }

            const cleanEmail = email.trim().toLowerCase();

            const user = await getUserByEmail(cleanEmail);

            if (!user) {

                return res.json({

                    success: true,

                    message: "If an account exists with this email, a verification code will be sent."

                });

            }

            const now = Date.now();

            const existingOTP = await dbGet(
                `
                SELECT last_sent_at
                FROM password_reset_otps
                WHERE user_id = ?
                `,
                [user.id]
            );

            if (
                existingOTP &&
                now - existingOTP.last_sent_at < OTP_RESEND_COOLDOWN_MS
            ) {

                return res.json({

                    success: true,

                    message: "If an account exists with this email, a verification code will be sent."

                });

            }

            const otp = crypto
                .randomInt(100000, 1000000)
                .toString();

            const otpHash = hashValue(otp);

            await dbRun(
                `
                INSERT INTO password_reset_otps (
                    user_id,
                    otp_hash,
                    expires_at,
                    attempts,
                    last_sent_at,
                    verified_at,
                    reset_token_hash,
                    reset_token_expires_at
                )
                VALUES (?, ?, ?, 0, ?, NULL, NULL, NULL)

                ON CONFLICT(user_id)
                DO UPDATE SET
                    otp_hash = excluded.otp_hash,
                    expires_at = excluded.expires_at,
                    attempts = 0,
                    last_sent_at = excluded.last_sent_at,
                    verified_at = NULL,
                    reset_token_hash = NULL,
                    reset_token_expires_at = NULL
                `,
                [
                    user.id,
                    otpHash,
                    now + OTP_EXPIRY_MS,
                    now
                ]
            );

            try {

                const safeName = String(user.name).replace(
                    /[&<>"']/g,
                    char => ({
                        "&": "&amp;",
                        "<": "&lt;",
                        ">": "&gt;",
                        '"': "&quot;",
                        "'": "&#39;"
                    })[char]
                );

                await transporter.sendMail({

                    from: `"CODE NEXA FORGE" <${GMAIL_USER}>`,

                    to: user.email,

                    subject: "Your CODE NEXA FORGE Password Reset Code",

                    text: `
Hello ${user.name},

You requested to reset your CODE NEXA FORGE password.

Your 6-digit verification code is:

${otp}

This code expires in 10 minutes.

If you did not request this code, please ignore this email.

CODE NEXA FORGE
Learn. Build. Master.
                    `,

                    html: `
                    <div style="
                        font-family: Arial, sans-serif;
                        max-width: 520px;
                        margin: auto;
                        padding: 30px;
                        background: #080b14;
                        color: #ffffff;
                        border-radius: 14px;
                    ">
                        <h2 style="color: #22d3ee;">
                            CODE NEXA FORGE
                        </h2>

                        <h3>Password Reset Verification</h3>

                        <p>Hello ${safeName},</p>

                        <p>
                            Use the verification code below
                            to reset your password.
                        </p>

                        <div style="
                            font-size: 32px;
                            font-weight: bold;
                            letter-spacing: 10px;
                            padding: 20px;
                            margin: 25px 0;
                            text-align: center;
                            background: #101625;
                            color: #22d3ee;
                            border-radius: 10px;
                        ">
                            ${otp}
                        </div>

                        <p>
                            This code expires in
                            <strong>10 minutes</strong>.
                        </p>

                        <p style="color: #929bb0;">
                            If you did not request this code,
                            you can safely ignore this email.
                        </p>

                        <p>CODE NEXA FORGE</p>
                    </div>
                    `

                });

            } catch (emailError) {

                console.error(
                    "OTP EMAIL ERROR:",
                    emailError.message
                );

                await dbRun(
                    "DELETE FROM password_reset_otps WHERE user_id = ?",
                    [user.id]
                );

                return sendError(
                    res,
                    500,
                    "Unable to send verification email. Please try again later."
                );

            }

            return res.json({

                success: true,

                message: "If an account exists with this email, a verification code will be sent."

            });

        } catch (error) {

            next(error);

        }

    }
);

/* ==========================================
   VERIFY PASSWORD RESET OTP
========================================== */

app.post(
    "/api/auth/verify-reset-otp",
    async (req, res, next) => {

        try {

            const { email, otp } = req.body || {};

            if (
                typeof email !== "string" ||
                typeof otp !== "string" ||
                !validEmail(email.trim()) ||
                !/^\d{6}$/.test(otp)
            ) {

                return sendError(
                    res,
                    400,
                    "Please enter a valid email and 6-digit code."
                );

            }

            const cleanEmail = email.trim().toLowerCase();

            const user = await getUserByEmail(cleanEmail);

            if (!user) {

                return sendError(
                    res,
                    400,
                    "Invalid or expired verification code."
                );

            }

            const record = await dbGet(
                "SELECT * FROM password_reset_otps WHERE user_id = ?",
                [user.id]
            );

            if (!record) {

                return sendError(
                    res,
                    400,
                    "Invalid or expired verification code."
                );

            }

            if (Date.now() > record.expires_at) {

                await dbRun(
                    "DELETE FROM password_reset_otps WHERE user_id = ?",
                    [user.id]
                );

                return sendError(
                    res,
                    400,
                    "Verification code has expired. Please request a new one."
                );

            }

            if (record.attempts >= OTP_MAX_ATTEMPTS) {

                await dbRun(
                    "DELETE FROM password_reset_otps WHERE user_id = ?",
                    [user.id]
                );

                return sendError(
                    res,
                    429,
                    "Too many incorrect attempts. Please request a new code."
                );

            }

            const submittedHash = hashValue(otp);

            if (!safeHashCompare(record.otp_hash, submittedHash)) {

                const updatedAttempts = record.attempts + 1;

                if (updatedAttempts >= OTP_MAX_ATTEMPTS) {

                    await dbRun(
                        "DELETE FROM password_reset_otps WHERE user_id = ?",
                        [user.id]
                    );

                    return sendError(
                        res,
                        429,
                        "Too many incorrect attempts. Please request a new code."
                    );

                }

                await dbRun(
                    "UPDATE password_reset_otps SET attempts = ? WHERE user_id = ?",
                    [updatedAttempts, user.id]
                );

                return sendError(
                    res,
                    400,
                    "Incorrect verification code."
                );

            }

            const resetToken = crypto
                .randomBytes(32)
                .toString("hex");

            const resetTokenHash = hashValue(resetToken);

            const now = Date.now();

            await dbRun(
                `
                UPDATE password_reset_otps
                SET
                    otp_hash = 'USED',
                    verified_at = ?,
                    reset_token_hash = ?,
                    reset_token_expires_at = ?
                WHERE user_id = ?
                `,
                [
                    now,
                    resetTokenHash,
                    now + RESET_TOKEN_EXPIRY_MS,
                    user.id
                ]
            );

            return res.json({

                success: true,

                message: "Verification successful. You can now reset your password.",

                resetToken

            });

        } catch (error) {

            next(error);

        }

    }
);

/* ==========================================
   RESET PASSWORD
========================================== */

app.post(
    "/api/auth/reset-password",
    async (req, res, next) => {

        try {

            const {
                email,
                resetToken,
                newPassword
            } = req.body || {};

            if (
                typeof email !== "string" ||
                typeof resetToken !== "string" ||
                typeof newPassword !== "string"
            ) {

                return sendError(
                    res,
                    400,
                    "Please provide all required fields."
                );

            }

            const cleanEmail = email.trim().toLowerCase();

            if (!validEmail(cleanEmail)) {

                return sendError(
                    res,
                    400,
                    "Please enter a valid email address."
                );

            }

            if (
                newPassword.length < 8 ||
                Buffer.byteLength(newPassword, "utf8") > 72
            ) {

                return sendError(
                    res,
                    400,
                    "Password must be at least 8 characters and no more than 72 bytes."
                );

            }

            if (!/^[a-f0-9]{64}$/i.test(resetToken)) {

                return sendError(
                    res,
                    400,
                    "Invalid or expired password reset session."
                );

            }

            const user = await getUserByEmail(cleanEmail);

            if (!user) {

                return sendError(
                    res,
                    400,
                    "Invalid or expired password reset session."
                );

            }

            const record = await dbGet(
                "SELECT * FROM password_reset_otps WHERE user_id = ?",
                [user.id]
            );

            if (
                !record ||
                !record.verified_at ||
                !record.reset_token_hash ||
                !record.reset_token_expires_at
            ) {

                return sendError(
                    res,
                    400,
                    "Please verify your email first."
                );

            }

            if (Date.now() > record.reset_token_expires_at) {

                await dbRun(
                    "DELETE FROM password_reset_otps WHERE user_id = ?",
                    [user.id]
                );

                return sendError(
                    res,
                    400,
                    "Password reset session has expired. Please start again."
                );

            }

            const submittedTokenHash = hashValue(resetToken);

            if (
                !safeHashCompare(
                    record.reset_token_hash,
                    submittedTokenHash
                )
            ) {

                return sendError(
                    res,
                    400,
                    "Invalid or expired password reset session."
                );

            }

            const hashedPassword = await bcrypt.hash(
                newPassword,
                12
            );

            await dbRun(
                "UPDATE users SET password = ? WHERE id = ?",
                [hashedPassword, user.id]
            );

            await dbRun(
                "DELETE FROM password_reset_otps WHERE user_id = ?",
                [user.id]
            );

            return res.json({

                success: true,

                message: "Your password has been reset successfully. Please log in with your new password."

            });

        } catch (error) {

            next(error);

        }

    }
);

/* ==========================================
   GET STUDENT PROGRESS API
========================================== */

app.get("/api/progress", requireLogin, (req, res, next) => {

    db.all(
        `
        SELECT
            lesson_id AS lessonId,
            course_name AS courseName,
            completed,
            completed_at AS completedAt
        FROM lesson_progress
        WHERE user_id = ?
        ORDER BY completed_at DESC
        `,
        [req.session.userId],
        (error, rows) => {

            if (error) return next(error);

            const completedLessons = rows.filter(
                lesson => lesson.completed === 1
            ).length;

            return res.json({

                success: true,

                summary: {

                    trackedLessons: rows.length,

                    completedLessons,

                    pendingLessons: rows.length - completedLessons

                },

                progress: rows

            });

        }
    );

});

/* ==========================================
   MARK LESSON AS COMPLETE API
========================================== */

app.post(
    "/api/progress/complete",
    requireLogin,
    (req, res, next) => {

        const { lessonId, courseName } = req.body || {};

        if (
            typeof lessonId !== "string" ||
            typeof courseName !== "string" ||
            !lessonId.trim() ||
            !courseName.trim()
        ) {

            return sendError(
                res,
                400,
                "Lesson ID and course name are required."
            );

        }

        if (
            lessonId.length > 100 ||
            courseName.length > 100
        ) {

            return sendError(
                res,
                400,
                "Invalid lesson information."
            );

        }

        db.run(
            `
            INSERT INTO lesson_progress
                (user_id, lesson_id, course_name, completed, completed_at)
            VALUES (?, ?, ?, 1, CURRENT_TIMESTAMP)

            ON CONFLICT(user_id, lesson_id)
            DO UPDATE SET
                course_name = excluded.course_name,
                completed = 1,
                completed_at = CURRENT_TIMESTAMP
            `,
            [
                req.session.userId,
                lessonId.trim(),
                courseName.trim()
            ],
            function (error) {

                if (error) return next(error);

                return res.json({

                    success: true,

                    message: "Lesson marked as complete."

                });

            }
        );

    }
);

/* ==========================================
   UNDO LESSON COMPLETION API
========================================== */

app.post(
    "/api/progress/undo",
    requireLogin,
    (req, res, next) => {

        const { lessonId } = req.body || {};

        if (
            typeof lessonId !== "string" ||
            !lessonId.trim() ||
            lessonId.length > 100
        ) {

            return sendError(
                res,
                400,
                "A valid lesson ID is required."
            );

        }

        db.run(
            `
            UPDATE lesson_progress
            SET
                completed = 0,
                completed_at = NULL
            WHERE user_id = ? AND lesson_id = ?
            `,
            [
                req.session.userId,
                lessonId.trim()
            ],
            function (error) {

                if (error) return next(error);

                if (this.changes === 0) {

                    return sendError(
                        res,
                        404,
                        "Lesson progress was not found."
                    );

                }

                return res.json({

                    success: true,

                    message: "Lesson completion has been undone."

                });

            }
        );

    }
);

/* ==========================================
   NEXA AI — INDEPENDENT LOCAL CHAT API
========================================== */

app.post(
    "/api/nexa-ai/chat",
    requireLogin,
    (req, res) => {

        try {

            const messages = req.body?.messages;

            /* Validate conversation */

            if (
                !Array.isArray(messages) ||
                messages.length === 0 ||
                messages.length > 20
            ) {

                return sendError(
                    res,
                    400,
                    "Please provide a valid conversation."
                );

            }

            /* Validate individual messages */

            for (const message of messages) {

                if (
                    !message ||
                    !["user", "assistant"].includes(message.role) ||
                    typeof message.content !== "string" ||
                    !message.content.trim() ||
                    message.content.length > 5000
                ) {

                    return sendError(
                        res,
                        400,
                        "Invalid message format."
                    );

                }

            }

            /* Get latest user message */

            const latestMessage = messages[messages.length - 1];

            if (latestMessage.role !== "user") {

                return sendError(
                    res,
                    400,
                    "Your latest message must be from the user."
                );

            }

            /* Separate memory for each logged-in user */

            const sessionId = String(req.session.userId);

            /* Generate response using local NEXA engine */

            const reply = nexaEngine.generateResponse(
                latestMessage.content,
                sessionId,
                messages.slice(0, -1)
            );

            return res.json({

                success: true,

                reply

            });

        } catch (error) {

            console.error(
                "NEXA AI LOCAL ENGINE ERROR:",
                error
            );

            return sendError(
                res,
                500,
                "NEXA AI encountered an internal error. Please try again."
            );

        }

    }
);

/* ==========================================
   DELETE ACCOUNT API
========================================== */

app.post(
    "/api/auth/delete-account",
    requireLogin,
    async (req, res, next) => {

        try {

            const { password } = req.body || {};

            if (
                typeof password !== "string" ||
                !password ||
                Buffer.byteLength(password, "utf8") > 72
            ) {

                return sendError(
                    res,
                    400,
                    "Please enter your current password."
                );

            }

            const userId = req.session.userId;

            const user = await dbGet(
                "SELECT id, password FROM users WHERE id = ?",
                [userId]
            );

            if (!user) {

                return sendError(
                    res,
                    404,
                    "Account not found."
                );

            }

            const passwordMatches = await bcrypt.compare(
                password,
                user.password
            );

            if (!passwordMatches) {

                return sendError(
                    res,
                    401,
                    "Incorrect password. Your account has not been deleted."
                );

            }

            await dbRun("BEGIN IMMEDIATE");

            try {

                await dbRun(
                    "DELETE FROM lesson_progress WHERE user_id = ?",
                    [userId]
                );

                await dbRun(
                    "DELETE FROM quiz_results WHERE user_id = ?",
                    [userId]
                );

                await dbRun(
                    "DELETE FROM password_reset_otps WHERE user_id = ?",
                    [userId]
                );

                const deletion = await dbRun(
                    "DELETE FROM users WHERE id = ?",
                    [userId]
                );

                if (deletion.changes !== 1) {

                    throw new Error(
                        "Account deletion could not be completed."
                    );

                }

                await dbRun("COMMIT");

            } catch (deletionError) {

                try {

                    await dbRun("ROLLBACK");

                } catch (rollbackError) {

                    console.error(
                        "DELETE ACCOUNT ROLLBACK ERROR:",
                        rollbackError
                    );

                }

                throw deletionError;

            }

            /* Clear local NEXA conversation memory */

            nexaEngine.clearSession(String(userId));

            req.session.destroy(sessionError => {

                if (sessionError) {

                    console.error(
                        "SESSION DESTROY ERROR:",
                        sessionError
                    );

                }

                res.clearCookie("cnf.sid", {

                    httpOnly: true,

                    secure: process.env.NODE_ENV === "production",

                    sameSite: "lax"

                });

                return res.json({

                    success: true,

                    message: "Your account and associated learning data have been permanently deleted."

                });

            });

        } catch (error) {

            next(error);

        }

    }
);

/* ==========================================
   LOGOUT API
========================================== */

app.post("/api/auth/logout", (req, res, next) => {

    req.session.destroy(error => {

        if (error) return next(error);

        res.clearCookie("cnf.sid", {

            httpOnly: true,

            secure: process.env.NODE_ENV === "production",

            sameSite: "lax"

        });

        return res.json({

            success: true,

            message: "You have been logged out successfully."

        });

    });

});


/* ==========================================
   STUDENT SUPPORT CONTACT API
========================================== */

const supportRequestBuckets = new Map();
const SUPPORT_WINDOW_MS = 15 * 60 * 1000;
const SUPPORT_MAX_REQUESTS = 4;

function escapeEmailHtml(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

app.post("/api/support/contact", async (req, res) => {
    try {
        const ip = String(req.ip || req.socket.remoteAddress || "unknown");
        const now = Date.now();

        // Drop expired entries to keep the in-memory limiter bounded.
        for (const [key, bucket] of supportRequestBuckets) {
            if (now - bucket.startedAt >= SUPPORT_WINDOW_MS) {
                supportRequestBuckets.delete(key);
            }
        }

        // Honeypot: silently accept automated submissions without sending mail.
        if (typeof req.body?.website === "string" && req.body.website.trim()) {
            return res.json({
                success: true,
                message: "Your support request has been received."
            });
        }

        const bucket = supportRequestBuckets.get(ip);
        if (bucket && now - bucket.startedAt < SUPPORT_WINDOW_MS &&
            bucket.count >= SUPPORT_MAX_REQUESTS) {
            return sendError(
                res,
                429,
                "Too many requests. Please try again in a little while."
            );
        }

        if (!bucket || now - bucket.startedAt >= SUPPORT_WINDOW_MS) {
            supportRequestBuckets.set(ip, { startedAt: now, count: 1 });
        } else {
            bucket.count += 1;
        }

        const { name, email, category, message } = req.body || {};
        const cleanName = typeof name === "string" ? name.trim() : "";
        const cleanEmail = typeof email === "string" ? email.trim() : "";
        const cleanCategory = typeof category === "string" ? category.trim() : "";
        const cleanMessage = typeof message === "string" ? message.trim() : "";

        const allowedCategories = [
            "Account & Login",
            "Course / Lesson",
            "Quiz & Progress",
            "NEXA Library",
            "NEXA AI",
            "Technical Issue",
            "Other"
        ];

        if (
            cleanName.length < 2 || cleanName.length > 80 ||
            /[\r\n]/.test(cleanName) ||
            cleanEmail.length > 254 ||
            !validEmail(cleanEmail) ||
            !allowedCategories.includes(cleanCategory) ||
            cleanMessage.length < 15 || cleanMessage.length > 3000
        ) {
            return sendError(
                res,
                400,
                "Please check your name, email, category and message. The message must contain at least 15 characters."
            );
        }

        if (!transporter || !GMAIL_USER) {
            return sendError(
                res,
                503,
                "Support email is temporarily unavailable. Please try again later."
            );
        }

        const safeName = escapeEmailHtml(cleanName);
        const safeEmail = escapeEmailHtml(cleanEmail);
        const safeCategory = escapeEmailHtml(cleanCategory);
        const safeMessage = escapeEmailHtml(cleanMessage).replace(/\r?\n/g, "<br>");

        await transporter.sendMail({
            from: `"CODE NEXA FORGE Support" <${GMAIL_USER}>`,
            to: process.env.SUPPORT_EMAIL || GMAIL_USER,
            replyTo: cleanEmail,
            subject: `[CODE NEXA FORGE Support] ${cleanCategory}`,
            text:
                `New student support request\n\n` +
                `Name: ${cleanName}\n` +
                `Student email: ${cleanEmail}\n` +
                `Category: ${cleanCategory}\n\n` +
                `Message:\n${cleanMessage}\n`,
            html: `
                <div style="font-family:Arial,sans-serif;color:#172033;line-height:1.6;max-width:680px">
                    <h2 style="color:#087e9a">CODE NEXA FORGE — Student Support</h2>
                    <p>A student has submitted a support request.</p>
                    <p><strong>Name:</strong> ${safeName}<br>
                    <strong>Email:</strong> ${safeEmail}<br>
                    <strong>Category:</strong> ${safeCategory}</p>
                    <hr>
                    <p><strong>Message</strong></p>
                    <p>${safeMessage}</p>
                    <hr>
                    <p style="font-size:12px;color:#667085">Reply to this email to respond directly to the student.</p>
                </div>
            `
        });

        return res.json({
            success: true,
            message: "Your support request has been sent. Our team will get back to you by email."
        });
    } catch (error) {
        console.error("SUPPORT EMAIL ERROR:", error.message);
        return sendError(
            res,
            500,
            "We could not send your request right now. Please try again later."
        );
    }
});


/* ==========================================
   UNKNOWN API ROUTES
========================================== */

app.use("/api", (req, res) => {

    return sendError(
        res,
        404,
        "API endpoint not found."
    );

});

/* ==========================================
   GLOBAL ERROR HANDLER
========================================== */

app.use((error, req, res, next) => {

    console.error("SERVER ERROR:", error);

    if (res.headersSent) {

        return next(error);

    }

    return sendError(
        res,
        500,
        "An internal server error occurred."
    );

});

/* ==========================================
   START SERVER
========================================== */

const server = app.listen(PORT, HOST, () => {

    console.log("");

    console.log("======================================");
    console.log("       CODE NEXA FORGE SERVER");
    console.log("======================================");

    console.log(`Website: http://localhost:${PORT}`);
    console.log(`Health:  http://localhost:${PORT}/api/health`);

    console.log("Authentication: ENABLED");
    console.log("Student Progress API: ENABLED");
    console.log("Password Reset OTP API: ENABLED");
    console.log("Delete Account API: ENABLED");
    console.log("Student Support Contact API: ENABLED");
    console.log("NEXA LIBRARY API: ENABLED");
    console.log("Admin Role System: ENABLED");
    console.log("Quiz Verification API: ENABLED");
    console.log("Quiz Results Database API: ENABLED");

    console.log("NEXA AI: INDEPENDENT LOCAL ENGINE ENABLED");

    console.log("Database: CONNECTED");
    console.log("Sessions: ENABLED");

    console.log(
        "Gmail OTP:",
        transporter ? "CONFIGURED" : "NOT CONFIGURED"
    );

    console.log("Server Status: RUNNING");
    console.log("======================================");
    console.log("");

});

/* ==========================================
   SERVER ERROR HANDLING
========================================== */

server.on("error", error => {

    if (error.code === "EADDRINUSE") {

        console.error(
            `Port ${PORT} is already in use.`
        );

    } else {

        console.error(
            "SERVER STARTUP ERROR:",
            error
        );

    }

});

/* ==========================================
   GRACEFUL SHUTDOWN
========================================== */

function shutdown(signal) {

    console.log(
        `${signal} received. Shutting down...`
    );

    server.close(() => {

        db.close(error => {

            if (error) {

                console.error(
                    "DATABASE CLOSE ERROR:",
                    error
                );

            }

            console.log(
                "Server and database closed."
            );

            process.exit(0);

        });

    });

}

process.on("SIGINT", () => shutdown("SIGINT"));

process.on("SIGTERM", () => shutdown("SIGTERM"));
