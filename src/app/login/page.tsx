import ProfileManager from "@/lib/ProfileManager";
import Header from "@/components/Header";
import LoginForm from "@/components/Login/LoginForm";
import styles from "./page.module.css";

export default async function Home() {
	const profileManager = await ProfileManager.default();
	const profile = await profileManager.getProfileFromCookies();

	return (
		<>
			<Header />
			<main id={styles.main}>
				<div id={styles.loginCard}>
					<h2>Login or create profile</h2>
					<LoginForm existingProfileId={profile?.id} />
				</div>
			</main>
		</>
	);
}
