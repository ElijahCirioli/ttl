export enum Theme {
	LightMode = "LIGHT_MODE",
	DarkMode = "DARK_MODE",
}

interface Settings {
	theme: Theme;
}

export function defaultSettings(): Settings {
	return {
		theme: Theme.LightMode,
	};
}

export default Settings;
