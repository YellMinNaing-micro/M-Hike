import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("userdb.db");

// ✅ Create table (once)
db.execAsync(`
    CREATE TABLE IF NOT EXISTS users (
                                         id INTEGER PRIMARY KEY AUTOINCREMENT,
                                         username TEXT NOT NULL,
                                         email TEXT NOT NULL,
                                         password TEXT NOT NULL
    );
`);

export type User = {
    id: number;
    username: string;
    email: string;
    password: string;
};

// ✅ Insert user
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

// ✅ Get all users
export const getAllUsers = async (): Promise<User[]> => {
    const result = await db.getAllAsync<User>("SELECT * FROM users;");
    return result;
};

// ✅ Get user by credentials
export const getUserByCredentials = async (
    username: string,
    email: string,
    password: string
): Promise<User | null | undefined> => {
    try {
        const result = await db.getFirstAsync<User>(
            "SELECT * FROM users WHERE username = ? AND email = ? AND password = ?;",
            [username, email, password]
        );
        return result;
    } catch (error) {
        console.error("❌ Error fetching user:", error);
        return null; // ✅ now valid
    }
};


export default db;
