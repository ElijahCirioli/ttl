import Db from "@/lib/db/Db";
import Profile from "@/lib/models/Profile";
import { PROFILE_COOKIE_NAME } from "./constants";
import SQLite from "@/lib/db/SQLite";
import { cookies } from "next/headers";

class ProfileManager {
	private db: Db;

	constructor(db: Db) {
		this.db = db;
	}

	async getProfileFromCookies(): Promise<Profile | undefined> {
		const cookieStore = await cookies();
		const profileId = cookieStore.get(PROFILE_COOKIE_NAME)?.value;
		if (!profileId) {
			return undefined;
		}
		return this.db.getProfile(profileId);
	}

	async createProfile(profile: Profile) {
		return this.db.createProfile(profile);
	}

	static async default(): Promise<ProfileManager> {
		const db = SQLite.default();
		await db.init();
		return new ProfileManager(db);
	}
}

export default ProfileManager;
