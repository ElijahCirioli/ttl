"use server";

import { PROFILE_COOKIE_NAME } from "@/lib/constants";
import { cookies } from "next/headers";

export async function refreshProfile(profileId: string) {
	const cookieStore = await cookies();
	cookieStore.set(PROFILE_COOKIE_NAME, profileId, { sameSite: "strict", maxAge: 34560000 });
}
