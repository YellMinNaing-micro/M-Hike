import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("userdb.db");

// Create the users table (if it doesn't exist)
db.execAsync(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL
  );
`);

export const insertUser = async (username: string, email: string, password: string) => {
    try {
        await db.runAsync(
            "INSERT INTO users (username, email, password) VALUES (?, ?, ?);",
            [username, email, password]
        );
        console.log("✅ User inserted successfully");
    } catch (error) {
        console.error("❌ Error inserting user:", error);
    }
};

export const getAllUsers = async () => {
    const result = await db.getAllAsync("SELECT * FROM users;");
    return result;
};

export default db;
