
"use strict";

const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

const databaseDirectory = __dirname;

if (!fs.existsSync(databaseDirectory)) {
    fs.mkdirSync(databaseDirectory, { recursive: true });
}

const databasePath = process.env.CNF_DATABASE_PATH
    ? path.resolve(process.env.CNF_DATABASE_PATH)
    : path.join(databaseDirectory, "cnf-users.db");

fs.mkdirSync(path.dirname(databasePath), { recursive: true });

const db = new sqlite3.Database(databasePath, (error) => {
    if (error) {
        console.error("DATABASE CONNECTION ERROR:", error.message);
        return;
    }

    console.log("CODE NEXA FORGE DATABASE CONNECTED");
});

db.serialize(() => {

    // ENABLE FOREIGN KEYS
    db.run("PRAGMA foreign_keys = ON");

    // USERS TABLE
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE COLLATE NOCASE,
            password TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'student'
                CHECK(role IN ('student', 'admin')),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (error) => {
        if (error) {
            console.error("USERS TABLE ERROR:", error.message);
        } else {
            console.log("USERS TABLE READY");
        }
    });

    // ADD ROLE TO EXISTING USERS TABLE
    db.all("PRAGMA table_info(users)", (error, columns) => {

        if (error) {
            console.error("USERS COLUMN CHECK ERROR:", error.message);
            return;
        }

        const roleExists = columns.some(
            column => column.name === "role"
        );

        if (!roleExists) {

            db.run(`
                ALTER TABLE users
                ADD COLUMN role TEXT NOT NULL DEFAULT 'student'
            `, (alterError) => {

                if (alterError) {
                    console.error(
                        "ADMIN ROLE MIGRATION ERROR:",
                        alterError.message
                    );
                } else {
                    console.log("ADMIN ROLE COLUMN ADDED");
                }

            });

        } else {

            console.log("ADMIN ROLE COLUMN READY");

        }

    });

    // LESSON PROGRESS TABLE
    db.run(`
        CREATE TABLE IF NOT EXISTS lesson_progress (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            lesson_id TEXT NOT NULL,
            course_name TEXT NOT NULL,
            completed INTEGER NOT NULL DEFAULT 0,
            completed_at DATETIME DEFAULT NULL,

            FOREIGN KEY (user_id)
                REFERENCES users(id)
                ON DELETE CASCADE,

            UNIQUE(user_id, lesson_id)
        )
    `, (error) => {
        if (error) {
            console.error("LESSON PROGRESS TABLE ERROR:", error.message);
        } else {
            console.log("LESSON PROGRESS TABLE READY");
        }
    });

    // PASSWORD RESET OTP TABLE
    db.run(`
        CREATE TABLE IF NOT EXISTS password_reset_otps (
            user_id INTEGER PRIMARY KEY,
            otp_hash TEXT NOT NULL,
            expires_at INTEGER NOT NULL,
            attempts INTEGER NOT NULL DEFAULT 0,
            last_sent_at INTEGER NOT NULL,
            verified_at INTEGER DEFAULT NULL,
            reset_token_hash TEXT DEFAULT NULL,
            reset_token_expires_at INTEGER DEFAULT NULL,

            FOREIGN KEY (user_id)
                REFERENCES users(id)
                ON DELETE CASCADE
        )
    `, (error) => {
        if (error) {
            console.error("PASSWORD RESET TABLE ERROR:", error.message);
        } else {
            console.log("PASSWORD RESET TABLE READY");
        }
    });

    // NEXA LIBRARY PDF TABLE
    db.run(`
        CREATE TABLE IF NOT EXISTS library_pdfs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,

            category TEXT NOT NULL
                CHECK(category IN ('HTML', 'CSS', 'JavaScript')),

            title TEXT NOT NULL,

            description TEXT DEFAULT '',

            original_name TEXT NOT NULL,

            stored_name TEXT NOT NULL UNIQUE,

            uploaded_by INTEGER NOT NULL,

            uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (uploaded_by)
                REFERENCES users(id)
                ON DELETE CASCADE
        )
    `, (error) => {
        if (error) {
            console.error("NEXA LIBRARY TABLE ERROR:", error.message);
        } else {
            console.log("NEXA LIBRARY TABLE READY");
        }
    });

    // LIBRARY CATEGORY INDEX
    db.run(`
        CREATE INDEX IF NOT EXISTS idx_library_pdfs_category
        ON library_pdfs(category)
    `, (error) => {
        if (error) {
            console.error("LIBRARY INDEX ERROR:", error.message);
        }
    });

    // QUIZ RESULTS TABLE
    // Scores will be calculated and saved by the server,
    // not accepted as trusted values from the browser.
    db.run(`
        CREATE TABLE IF NOT EXISTS quiz_results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,

            user_id INTEGER NOT NULL,

            quiz_id TEXT NOT NULL,

            course_name TEXT NOT NULL,

            quiz_title TEXT NOT NULL,

            score INTEGER NOT NULL
                CHECK(score >= 0),

            total_questions INTEGER NOT NULL
                CHECK(total_questions > 0),

            percentage REAL NOT NULL
                CHECK(percentage >= 0 AND percentage <= 100),

            passed INTEGER NOT NULL
                CHECK(passed IN (0, 1)),

            submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (user_id)
                REFERENCES users(id)
                ON DELETE CASCADE,

            CHECK(score <= total_questions)
        )
    `, (error) => {
        if (error) {
            console.error("QUIZ RESULTS TABLE ERROR:", error.message);
        } else {
            console.log("QUIZ RESULTS TABLE READY");
        }
    });

    // QUIZ RESULTS USER HISTORY INDEX
    db.run(`
        CREATE INDEX IF NOT EXISTS idx_quiz_results_user
        ON quiz_results(user_id, submitted_at DESC)
    `, (error) => {
        if (error) {
            console.error("QUIZ USER INDEX ERROR:", error.message);
        }
    });

    // QUIZ RESULTS COURSE INDEX
    db.run(`
        CREATE INDEX IF NOT EXISTS idx_quiz_results_course
        ON quiz_results(user_id, course_name)
    `, (error) => {
        if (error) {
            console.error("QUIZ COURSE INDEX ERROR:", error.message);
        }
    });

});

module.exports = db;
