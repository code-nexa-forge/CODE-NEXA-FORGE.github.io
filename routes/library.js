
"use strict";

/* ==========================================
   CODE NEXA FORGE — NEXA LIBRARY ROUTES
========================================== */

const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const router = express.Router();

/* ==========================================
   STORAGE CONFIGURATION
========================================== */

// PDFs are stored outside the public folder.
const STORAGE_DIR = process.env.CNF_LIBRARY_DIR
    ? path.resolve(process.env.CNF_LIBRARY_DIR)
    : path.join(__dirname, "..", "storage", "library");

if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
}

const MAX_FILE_SIZE = 20 * 1024 * 1024;

const ALLOWED_CATEGORIES = [
    "HTML",
    "CSS",
    "JavaScript"
];

/* ==========================================
   DATABASE HELPERS
========================================== */

function dbGet(db, sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (error, row) => {
            if (error) return reject(error);
            resolve(row);
        });
    });
}

function dbRun(db, sql, params = []) {
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

/* ==========================================
   ADMIN AUTHORIZATION
========================================== */

function createAdminMiddleware(db) {
    return async function requireAdmin(req, res, next) {
        try {
            const user = await dbGet(
                db,
                "SELECT id, role FROM users WHERE id = ?",
                [req.session.userId]
            );

            if (!user || user.role !== "admin") {
                return res.status(403).json({
                    success: false,
                    message: "Admin permission required."
                });
            }

            next();

        } catch (error) {
            console.error("ADMIN CHECK ERROR:", error);

            res.status(500).json({
                success: false,
                message: "Unable to verify admin permission."
            });
        }
    };
}

/* ==========================================
   MULTER PDF UPLOAD CONFIGURATION
========================================== */

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, STORAGE_DIR);
    },

    filename: function (req, file, callback) {
        const uniqueName =
            crypto.randomUUID() + ".pdf";

        callback(null, uniqueName);
    }
});

const upload = multer({
    storage: storage,

    limits: {
        fileSize: MAX_FILE_SIZE,
        files: 1
    },

    fileFilter: function (req, file, callback) {
        if (file.mimetype !== "application/pdf") {
            return callback(
                new Error("Only PDF files are allowed.")
            );
        }

        callback(null, true);
    }
});

/* ==========================================
   PDF VALIDATION
========================================== */

function isValidPDF(filePath) {
    const buffer = Buffer.alloc(5);

    const fd = fs.openSync(filePath, "r");

    try {
        const bytesRead = fs.readSync(
            fd,
            buffer,
            0,
            5,
            0
        );

        return (
            bytesRead === 5 &&
            buffer.toString("ascii") === "%PDF-"
        );

    } finally {
        fs.closeSync(fd);
    }
}

function removeFile(filePath) {
    if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
}

function getSafeDownloadName(name) {
    const safeName = path
        .basename(name || "resource.pdf")
        .replace(/[^a-zA-Z0-9._ -]/g, "_")
        .slice(0, 150);

    return safeName.toLowerCase().endsWith(".pdf")
        ? safeName
        : safeName + ".pdf";
}

/* ==========================================
   ROUTER SETUP
========================================== */

module.exports = function createLibraryRouter(options) {

    const db = options.db;
    const requireLogin = options.requireLogin;
    const requireAdmin = createAdminMiddleware(db);

    /* ======================================
       GET ALL LIBRARY RESOURCES
    ====================================== */

    router.get("/", requireLogin, async (req, res) => {
        try {
            const category = req.query.category;

            let sql = `
                SELECT
                    id,
                    category,
                    title,
                    description,
                    original_name,
                    uploaded_at
                FROM library_pdfs
            `;

            const params = [];

            if (category) {
                if (!ALLOWED_CATEGORIES.includes(category)) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid resource category."
                    });
                }

                sql += " WHERE category = ?";
                params.push(category);
            }

            sql += " ORDER BY uploaded_at DESC";

            const rows = await new Promise((resolve, reject) => {
                db.all(sql, params, (error, results) => {
                    if (error) return reject(error);
                    resolve(results);
                });
            });

            res.json({
                success: true,
                resources: rows
            });

        } catch (error) {
            console.error("LIBRARY LIST ERROR:", error);

            res.status(500).json({
                success: false,
                message: "Unable to load library resources."
            });
        }
    });

    /* ======================================
       UPLOAD PDF — ADMIN ONLY
    ====================================== */

    router.post(
        "/upload",
        requireLogin,
        requireAdmin,
        (req, res, next) => {
            upload.single("pdf")(req, res, (error) => {
                if (error) {
                    return res.status(400).json({
                        success: false,
                        message: error.message
                    });
                }

                next();
            });
        },
        async (req, res) => {
            let filePath = null;

            try {
                if (!req.file) {
                    return res.status(400).json({
                        success: false,
                        message: "Please select a PDF file."
                    });
                }

                filePath = req.file.path;

                const category = req.body.category;
                const title = String(req.body.title || "").trim();
                const description = String(
                    req.body.description || ""
                ).trim();

                if (!ALLOWED_CATEGORIES.includes(category)) {
                    removeFile(filePath);

                    return res.status(400).json({
                        success: false,
                        message: "Invalid PDF category."
                    });
                }

                if (!title || title.length > 150) {
                    removeFile(filePath);

                    return res.status(400).json({
                        success: false,
                        message: "Title is required and must be under 150 characters."
                    });
                }

                if (description.length > 1000) {
                    removeFile(filePath);

                    return res.status(400).json({
                        success: false,
                        message: "Description must be under 1000 characters."
                    });
                }

                if (!isValidPDF(filePath)) {
                    removeFile(filePath);

                    return res.status(400).json({
                        success: false,
                        message: "The uploaded file is not a valid PDF."
                    });
                }

                const result = await dbRun(
                    db,
                    `
                    INSERT INTO library_pdfs (
                        category,
                        title,
                        description,
                        original_name,
                        stored_name,
                        uploaded_by
                    )
                    VALUES (?, ?, ?, ?, ?, ?)
                    `,
                    [
                        category,
                        title,
                        description,
                        req.file.originalname,
                        req.file.filename,
                        req.session.userId
                    ]
                );

                res.status(201).json({
                    success: true,
                    message: "PDF uploaded successfully.",
                    resourceId: result.lastID
                });

            } catch (error) {
                if (filePath) {
                    removeFile(filePath);
                }

                console.error("PDF UPLOAD ERROR:", error);

                res.status(500).json({
                    success: false,
                    message: "Unable to upload PDF."
                });
            }
        }
    );

    /* ======================================
       VIEW PDF ONLINE
    ====================================== */

    router.get(
        "/:id/view",
        requireLogin,
        async (req, res) => {
            try {
                const resource = await dbGet(
                    db,
                    "SELECT * FROM library_pdfs WHERE id = ?",
                    [req.params.id]
                );

                if (!resource) {
                    return res.status(404).json({
                        success: false,
                        message: "PDF not found."
                    });
                }

                const filePath = path.join(
                    STORAGE_DIR,
                    resource.stored_name
                );

                if (!fs.existsSync(filePath)) {
                    return res.status(404).json({
                        success: false,
                        message: "PDF file is missing."
                    });
                }

                res.setHeader(
                    "Content-Type",
                    "application/pdf"
                );

                res.setHeader(
                    "Content-Disposition",
                    "inline; filename=\"resource.pdf\""
                );

                res.setHeader("X-Content-Type-Options", "nosniff");

                res.sendFile(filePath);

            } catch (error) {
                console.error("PDF VIEW ERROR:", error);

                res.status(500).json({
                    success: false,
                    message: "Unable to open PDF."
                });
            }
        }
    );

    /* ======================================
       DOWNLOAD PDF
    ====================================== */

    router.get(
        "/:id/download",
        requireLogin,
        async (req, res) => {
            try {
                const resource = await dbGet(
                    db,
                    "SELECT * FROM library_pdfs WHERE id = ?",
                    [req.params.id]
                );

                if (!resource) {
                    return res.status(404).json({
                        success: false,
                        message: "PDF not found."
                    });
                }

                const filePath = path.join(
                    STORAGE_DIR,
                    resource.stored_name
                );

                if (!fs.existsSync(filePath)) {
                    return res.status(404).json({
                        success: false,
                        message: "PDF file is missing."
                    });
                }

                res.download(
                    filePath,
                    getSafeDownloadName(resource.original_name)
                );

            } catch (error) {
                console.error("PDF DOWNLOAD ERROR:", error);

                res.status(500).json({
                    success: false,
                    message: "Unable to download PDF."
                });
            }
        }
    );

    /* ======================================
       DELETE PDF — ADMIN ONLY
    ====================================== */

    router.delete(
        "/:id",
        requireLogin,
        requireAdmin,
        async (req, res) => {
            try {
                const resource = await dbGet(
                    db,
                    "SELECT * FROM library_pdfs WHERE id = ?",
                    [req.params.id]
                );

                if (!resource) {
                    return res.status(404).json({
                        success: false,
                        message: "PDF not found."
                    });
                }

                await dbRun(
                    db,
                    "DELETE FROM library_pdfs WHERE id = ?",
                    [req.params.id]
                );

                const filePath = path.join(
                    STORAGE_DIR,
                    resource.stored_name
                );

                removeFile(filePath);

                res.json({
                    success: true,
                    message: "PDF deleted successfully."
                });

            } catch (error) {
                console.error("PDF DELETE ERROR:", error);

                res.status(500).json({
                    success: false,
                    message: "Unable to delete PDF."
                });
            }
        }
    );

    return router;
};
