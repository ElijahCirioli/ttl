"use server";

import { PROFILE_COOKIE_NAME } from "@/lib/constants";
import ProfileManager from "@/lib/ProfileManager";
import { defaultProfile } from "@/lib/models/Profile";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function submitLoginForm(data: FormData) {
	const profileId = data.get("profileInput")?.valueOf().toString();
	if (profileId) {
		const profileManager = await ProfileManager.default();
		const cookieStore = await cookies();
		cookieStore.set(PROFILE_COOKIE_NAME, profileId, { sameSite: "strict", maxAge: 34560000 });
		let profile = await profileManager.getProfileFromCookies();
		if (!profile) {
			profile = defaultProfile(profileId);
			await profileManager.createProfile(profile);
		}
		if (profile.cards.length === 0) {
			redirect("/add");
		} else {
			redirect("/");
		}
	}
}
