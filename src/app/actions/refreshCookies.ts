"use server";

import { PROFILE_COOKIE_NAME } from "@/lib/cookies";
import { cookies } from "next/headers";

export async function refreshProfile(profile: string) {
	const cookieStore = await cookies();
	cookieStore.set(PROFILE_COOKIE_NAME, profile, { sameSite: "strict", maxAge: 34560000 });
}
