export enum RouteType {
	Bus = "BUS",
	StreetCar = "STREET_CAR",
	LightRail = "LIGHT_RAIL",
	Metro = "METRO",
	CommuterRail = "COMMUTER_RAIL",
	AerialTram = "AERIAL_TRAM",
}

export interface Route {
	id: string;
	type: RouteType;
	name: string;
	destination: string;
	color?: string;
}
