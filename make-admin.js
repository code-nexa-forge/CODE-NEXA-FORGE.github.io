"use strict";

// One-time owner admin bootstrap for CODE NEXA FORGE.
// This script can promote ONLY the configured owner email.
const db = require("./database/database");
const OWNER_EMAIL = String(process.env.OWNER_ADMIN_EMAIL || "").trim();

if (!OWNER_EMAIL) {
    console.error("OWNER_ADMIN_EMAIL is missing. Set it privately before running this script.");
    process.exit(1);
}

console.log("\n================================");
console.log("   CODE NEXA FORGE ADMIN SETUP");
console.log("================================\n");

db.get(
    "SELECT id, name, email FROM users WHERE email = ? COLLATE NOCASE",
    [OWNER_EMAIL],
    (error, user) => {
        if (error) {
            console.error("DATABASE ERROR:", error.message);
            return db.close();
        }

        if (!user) {
            console.error("Owner account was not found. Sign up with the configured owner email first.");
            return db.close();
        }

        db.serialize(() => {
            db.run("BEGIN IMMEDIATE TRANSACTION");
            db.run(
                "UPDATE users SET role = 'student' WHERE id <> ?",
                [user.id],
                (demoteError) => {
                    if (demoteError) {
                        console.error("Unable to restrict other accounts:", demoteError.message);
                        return db.run("ROLLBACK", () => db.close());
                    }
                    db.run(
                        "UPDATE users SET role = 'admin' WHERE id = ?",
                        [user.id],
                        function (promoteError) {
                            if (promoteError) {
                                console.error("ADMIN SETUP ERROR:", promoteError.message);
                                return db.run("ROLLBACK", () => db.close());
                            }
                            db.run("COMMIT", (commitError) => {
                                if (commitError) {
                                    console.error("COMMIT ERROR:", commitError.message);
                                } else {
                                    console.log("ADMIN SETUP SUCCESS");
                                    console.log("Name:", user.name);
                                    console.log("Email:", user.email);
                                    console.log("Role: ADMIN");
                                    console.log("All other accounts: STUDENT");
                                }
                                db.close();
                            });
                        }
                    );
                }
            );
        });
    }
);
