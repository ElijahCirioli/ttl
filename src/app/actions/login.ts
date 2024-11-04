"use server";

import { PROFILE_COOKIE_NAME } from "@/lib/cookies";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function submitLoginForm(data: FormData) {
	const profile = data.get("profileInput")?.valueOf().toString();
	if (profile) {
		const cookieStore = await cookies();
		cookieStore.set(PROFILE_COOKIE_NAME, profile, { sameSite: "strict", maxAge: 34560000 });
		redirect("/");
	}
}
