"use server";

import { PROFILE_COOKIE_NAME } from "@/lib/cookies";
import { getProfile, createProfile } from "@/lib/db";
import { defaultSettings } from "@/lib/models/Profile";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function submitLoginForm(data: FormData) {
	const profileId = data.get("profileInput")?.valueOf().toString();
	if (profileId) {
		const cookieStore = await cookies();
		cookieStore.set(PROFILE_COOKIE_NAME, profileId, { sameSite: "strict", maxAge: 34560000 });
		const profile = await getProfile(profileId);
		if (!profile) {
			await createProfile(defaultSettings(profileId));
		}
		redirect("/");
	}
}
