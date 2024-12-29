export enum RouteType {
	Bus = "Bus",
	StreetCar = "Streetcar",
	LightRail = "Light Rail",
	Metro = "Metro",
	CommuterRail = "Commuter Rail",
	AerialTram = "Aerial Tram",
}

export interface Route {
	id: string;
	type: RouteType;
	name: string;
	destination: string;
	color?: string;
}
