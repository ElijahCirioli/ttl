import assert from "node:assert";
import { resolve } from "node:path";
import { Database, open } from "sqlite";
import sqlite3 from "sqlite3";
import { DATABASE_FILE_PATH } from "@/lib/constants";
import Profile from "@/lib/models/Profile";
import Db from "./Db";

class SQLite implements Db {
	private filePath: string;
	private connection?: Database;

	constructor(filePath: string) {
		this.filePath = filePath;
	}

	private assertConnection() {
		assert(this.connection, "No database connection. Did you forget to call init()?");
	}

	async init() {
		this.connection = await open({
			filename: resolve(this.filePath),
			driver: sqlite3.cached.Database,
			mode: sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
		});
		console.log("Database connected successfully");
	}

	async createTables() {
		this.assertConnection();
		await this.connection?.run(
			`CREATE TABLE IF NOT EXISTS profiles (
				"id" TEXT PRIMARY KEY,
				"profile" TEXT
        	)`
		);
	}

	async getProfile(id: string): Promise<Profile | undefined> {
		this.assertConnection();
		console.log("Getting Profile from table");
		const sql = "SELECT * FROM profiles WHERE id = ?";
		const row = await this.connection?.get(sql, id);
		if (row) {
			return JSON.parse(row.profile) as Profile;
		}
	}

	async createProfile(profile: Profile) {
		this.assertConnection();
		console.log("Creating Profile in table");
		const sql = "INSERT INTO profiles VALUES (?, ?)";
		await this.connection?.run(sql, [profile.id, JSON.stringify(profile)]);
	}

	async updateProfile(profile: Profile) {
		this.assertConnection();
		console.log("Updating Profile in table");
		const sql = "UPDATE profiles SET profile = ? WHERE id = ?";
		await this.connection?.run(sql, [JSON.stringify(profile), profile.id]);
	}

	static default(): SQLite {
		return new SQLite(DATABASE_FILE_PATH);
	}
}

export default SQLite;
