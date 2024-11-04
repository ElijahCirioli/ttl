import { submitLoginForm } from "@/actions/login";
import { getProfile } from "@/lib/cookies";

export default async function Home() {
	const profile = await getProfile();

	return (
		<form action={submitLoginForm}>
			<label htmlFor="profileInput">Profile name:</label>
			<input id="profileInput" name="profileInput" type="text" defaultValue={profile ?? ""} />
			<button type="submit">Submit</button>
		</form>
	);
}
