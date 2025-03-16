export enum RouteType {
	Bus = "Bus",
	StreetCar = "Streetcar",
	LightRail = "Light Rail",
	Metro = "Metro",
	CommuterRail = "Commuter Rail",
	AerialTram = "Aerial Tram",
}

export type RouteId = string;

interface Route {
	id: RouteId;
	type: RouteType;
	name: string;
	destination: string;
	color?: string;
}

export default Route;
