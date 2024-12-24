"use server";

import { cookies } from "next/headers";
import { PROFILE_COOKIE_NAME } from "@/lib/constants";

export async function refreshProfile(profileId: string) {
	const cookieStore = await cookies();
	cookieStore.set(PROFILE_COOKIE_NAME, profileId, { sameSite: "strict", maxAge: 34560000 });
}
