import StopBrowser from "@/components/StopBrowser";
import ProfileManager from "@/lib/ProfileManager";
import { redirect } from "next/navigation";

export default async function Home() {
	const profileManager = await ProfileManager.default();
	const profile = await profileManager.getProfileFromCookies();
	if (!profile) {
		return redirect("/login");
	}
	return <StopBrowser />;
}
