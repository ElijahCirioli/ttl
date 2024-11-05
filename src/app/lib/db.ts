import Profile from "@/lib/models/Profile";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { resolve } from "node:path";

const DATABASE_FILE_PATH = "database/ttl.db";

const db = await open({
	filename: resolve(DATABASE_FILE_PATH),
	driver: sqlite3.cached.Database,
	mode: sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
});
console.log("Database connected successfully");

export async function createTables() {
	db.run(
		`CREATE TABLE IF NOT EXISTS profiles (
            "id" TEXT PRIMARY KEY,
            "theme" TEXT
        )`
	);
}

export async function getProfile(id: string): Promise<Profile | undefined> {
	console.log("Getting Profile from table");
	const sql = "SELECT * FROM profiles WHERE id = ?";
	const row = await db.get(sql, id);
	return row as Profile | undefined;
}

export async function createProfile(profile: Profile) {
	console.log("Creating Profile in table");
	const sql = "INSERT INTO profiles VALUES (?, ?)";
	await db.run(sql, [profile.id, profile.theme]);
}
