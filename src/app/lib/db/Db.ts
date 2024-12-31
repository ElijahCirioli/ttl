import Profile from "@/lib/models/Profile";

interface Db {
	init(): Promise<void>;
	createTables(): Promise<void>;
	getProfile(id: string): Promise<Profile | undefined>;
	createProfile(profile: Profile): Promise<void>;
	updateProfile(profile: Profile): Promise<void>;
}

export default Db;
