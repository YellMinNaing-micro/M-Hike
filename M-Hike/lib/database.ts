// database.ts
import * as SQLite from "expo-sqlite";

let db: SQLite.SQLiteDatabase | null = null;

// ✅ Open DB and create both tables if not exist
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

            CREATE TABLE IF NOT EXISTS entries (
                                                   id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                   name TEXT,
                                                   location TEXT,
                                                   length REAL,
                                                   dateOfHike TEXT,
                                                   parkingAvailable INTEGER,
                                                   hours INTEGER,
                                                   minutes INTEGER,
                                                   hikers INTEGER,
                                                   difficulty TEXT,
                                                   description TEXT,
                                                   animalSightings TEXT,
                                                   vegetation TEXT,
                                                   weather TEXT,
                                                   trail TEXT,
                                                   timeOfObservation TEXT,
                                                   additionalComments TEXT
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

export const insertEntry = async (entry: any) => {
    try {
        const database = await openDB();
        await database.runAsync(
            `INSERT INTO entries (
        name, location, length, dateOfHike, parkingAvailable,
        hours, minutes, hikers, difficulty, description,
        animalSightings, vegetation, weather, trail,
        timeOfObservation, additionalComments
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                entry.name,
                entry.location,
                parseFloat(entry.length),
                entry.dateOfHike,
                entry.parkingAvailable ? 1 : 0,
                parseInt(entry.hours),
                parseInt(entry.minutes),
                parseInt(entry.hikers),
                entry.difficulty,
                entry.description,
                entry.animalSightings,
                entry.vegetation,
                entry.weather,
                entry.trail,
                entry.timeOfObservation,
                entry.additionalComments,
            ]
        );
        console.log("✅ Entry inserted successfully");
    } catch (error) {
        console.error("❌ Error inserting entry:", error);
    }
};

// ✅ GET all entries
export const getAllEntries = async () => {
    const database = await openDB();
    return await database.getAllAsync("SELECT * FROM entries ORDER BY id DESC;");
};

// ✅ GET entry by ID
export const getEntryById = async (id: number) => {
    const database = await openDB();
    const result = await database.getFirstAsync(
        "SELECT * FROM entries WHERE id = ?;",
        [id]
    );
    return result ?? null;
};

// ✅ UPDATE entry
export const updateEntry = async (entry: any) => {
    try {
        const database = await openDB();
        await database.runAsync(
            `UPDATE entries SET
        name = ?, location = ?, length = ?, dateOfHike = ?, parkingAvailable = ?,
        hours = ?, minutes = ?, hikers = ?, difficulty = ?, description = ?,
        animalSightings = ?, vegetation = ?, weather = ?, trail = ?,
        timeOfObservation = ?, additionalComments = ?
      WHERE id = ?;`,
            [
                entry.name,
                entry.location,
                entry.length,
                entry.dateOfHike,
                entry.parkingAvailable ? 1 : 0,
                entry.hours,
                entry.minutes,
                entry.hikers,
                entry.difficulty,
                entry.description,
                entry.animalSightings,
                entry.vegetation,
                entry.weather,
                entry.trail,
                entry.timeOfObservation,
                entry.additionalComments,
                entry.id,
            ]
        );
        console.log("✅ Entry updated successfully");
    } catch (error) {
        console.error("❌ Error updating entry:", error);
    }
};

// ✅ DELETE entry by ID
export const deleteEntry = async (id: number) => {
    try {
        const database = await openDB();
        await database.runAsync("DELETE FROM entries WHERE id = ?;", [id]);
        console.log("🗑️ Entry deleted successfully");
    } catch (error) {
        console.error("❌ Error deleting entry:", error);
    }
};

