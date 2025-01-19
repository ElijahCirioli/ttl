import { redirect } from "next/navigation";
import CardViewer from "@/components/CardViewer/CardViewer";
import Header from "@/components/Header";
import ProfileManager from "./lib/ProfileManager";
import styles from "./page.module.css";

export default async function Home() {
	console.log("pulling profile");
	const profileManager = await ProfileManager.default();
	const profile = await profileManager.getProfileFromCookies();
	if (!profile) {
		return redirect("/login");
	}
	console.log("Got profile from database:", profile?.id);
	return (
		<>
			<Header showEditButton={true} />
			<main id={styles.main}>
				<CardViewer profile={profile} />
			</main>
		</>
	);
}
