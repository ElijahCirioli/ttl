import { defaultSettings } from "./Settings";
import Settings from "./Settings";
import Card from "./Card";

interface Profile {
	id: string;
	settings: Settings;
	cards: Card[];
}

export function defaultProfile(id: string): Profile {
	return {
		id,
		settings: defaultSettings(),
		cards: [],
	};
}

export default Profile;
