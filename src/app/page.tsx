import DataViewer from "@/components/DataViewer";
import ProfileManager from "./lib/ProfileManager";
import { redirect } from "next/navigation";

export default async function Home() {
	console.log("pulling profile");
	const profileManager = await ProfileManager.default();
	const profile = await profileManager.getProfileFromCookies();
	if (!profile) {
		return redirect("/login");
	}
	console.log("Got profile from database: ", profile?.id);
	return <DataViewer profile={profile} />;
}
