"use server";

import ProfileManager from "@/lib/ProfileManager";

export async function doesProfileExist(profileId: string): Promise<boolean> {
	const profileManager = await ProfileManager.default();
	const profile = await profileManager.getProfileFromId(profileId);
	return profile !== undefined;
}
