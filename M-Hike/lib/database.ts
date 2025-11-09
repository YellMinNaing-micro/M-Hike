// database.ts
import * as SQLite from "expo-sqlite";

let db: SQLite.SQLiteDatabase | null = null;

// ✅ Open or create DB and ensure table exists
export const openDB = async (): Promise<SQLite.SQLiteDatabase> => {
    if (!db) {
        db = await SQLite.openDatabaseAsync("m-hike.db");
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS users (
                                                 id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                 username TEXT NOT NULL,
                                                 email TEXT NOT NULL,
                                                 password TEXT NOT NULL
            );
        `);
    }
    return db;
};

// ✅ Insert user
export const insertUser = async (username: string, email: string, password: string) => {
    try {
        const database = await openDB();
        await database.runAsync(
            "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
            [username, email, password]
        );
        console.log("✅ User inserted successfully");
    } catch (error) {
        console.error("❌ Error inserting user:", error);
    }
};

// ✅ Get all users
export const getAllUsers = async () => {
    const database = await openDB();
    const result = await database.getAllAsync("SELECT * FROM users;");
    console.log("👥 All users:", result);
    return result;
};

// ✅ Get single user by credentials
export const getUserByCredentials = async (
    username: string,
    email: string,
    password: string
) => {
    const database = await openDB();
    const result = await database.getFirstAsync(
        "SELECT * FROM users WHERE username = ? AND email = ? AND password = ?;",
        [username, email, password]
    );
    return result ?? null;
};

// ✅ Update password
export const updatePassword = async (username: string, email: string, newPassword: string) => {
    try {
        const database = await openDB();
        await database.runAsync(
            "UPDATE users SET password = ? WHERE username = ? AND email = ?;",
            [newPassword, username, email]
        );
        console.log("🔑 Password updated successfully");
        return true;
    } catch (error) {
        console.error("❌ Error updating password:", error);
        return false;
    }
};

// ✅ Log all users (debug helper)
export const logAllUsers = async () => {
    const users = await getAllUsers();
    console.log("📋 All Users in DB:", users);
    return users;
};

export const updateUser = async (user: { id: number, username: string, email: string, password: string }) => {
    try {
        const database = await openDB();
        await database.runAsync(
            "UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?;",
            [user.username, user.email, user.password, user.id]
        );
        console.log("✅ User updated successfully");
        return true;
    } catch (error) {
        console.error("❌ Error updating user:", error);
        return false;
    }
};

