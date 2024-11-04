import { getProfile } from "@/lib/cookies";
import DataViewer from "@/components/DataViewer";
import { redirect } from "next/navigation";

export default async function Home() {
	const profile = await getProfile();
	if (profile) {
		return <DataViewer profile={profile} />;
	}
	return redirect("/login");
}
