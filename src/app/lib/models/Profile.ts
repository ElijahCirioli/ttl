import Card from "./Card";
import { defaultSettings } from "./Settings";
import Settings from "./Settings";

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
