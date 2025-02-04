import { redirect } from "next/navigation";
import HomePage from "@/components/HomePage";
import ProfileManager from "./lib/ProfileManager";

export default async function Home() {
	const profileManager = await ProfileManager.default();
	const profile = await profileManager.getProfileFromCookies();
	if (!profile) {
		return redirect("/login");
	}
	console.log("Got profile from database:", profile?.id);
	return <HomePage profile={profile} />;
}
