import { getProfileId } from "@/lib/cookies";
import { getProfile } from "@/lib/db";
import Profile from "@/lib/models/Profile";
import DataViewer from "@/components/DataViewer";
import { redirect } from "next/navigation";

export default async function Home() {
	const profileId = await getProfileId();
	if (profileId) {
		const profile: Profile | undefined = await getProfile(profileId);
		if (profile) {
			console.log("Got profile from database: ", profile);
		}
		return <DataViewer profile={profileId} />;
	}
	return redirect("/login");
}
