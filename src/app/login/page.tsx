import { submitLoginForm } from "@/actions/login";
import ProfileManager from "@/lib/ProfileManager";

export default async function Home() {
	const profileManager = await ProfileManager.default();
	const profile = await profileManager.getProfileFromCookies();

	return (
		<form action={submitLoginForm}>
			<label htmlFor="profileInput">Profile name:</label>
			<input id="profileInput" name="profileInput" type="text" defaultValue={profile?.id ?? ""} />
			<button type="submit">Submit</button>
		</form>
	);
}
