import { cookies } from "next/headers";

export const PROFILE_COOKIE_NAME = "profile";

export async function getProfile(): Promise<string | undefined> {
	const cookieStore = await cookies();
	return cookieStore.get(PROFILE_COOKIE_NAME)?.value;
}
