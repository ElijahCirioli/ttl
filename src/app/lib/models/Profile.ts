interface Profile {
	id: string;
	theme: Theme;
}

enum Theme {
	LightMode = "LIGHT_MODE",
	DarkMode = "DARK_MODE",
}

export function defaultSettings(profileId: string): Profile {
	return {
		id: profileId,
		theme: Theme.LightMode,
	};
}

export default Profile;
