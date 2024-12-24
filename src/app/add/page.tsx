import { redirect } from "next/navigation";
import ProfileManager from "@/lib/ProfileManager";
import Header from "@/components/Header";
import StopBrowser from "@/components/StopBrowser";
import styles from "./page.module.css";

export default async function Home() {
	const profileManager = await ProfileManager.default();
	const profile = await profileManager.getProfileFromCookies();
	if (!profile) {
		return redirect("/login");
	}
	return (
		<>
			<Header showEditButton={false} />
			<main id={styles.main}>
				<StopBrowser profile={profile} />
			</main>
		</>
	);
}
