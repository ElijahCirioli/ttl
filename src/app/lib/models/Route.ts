export enum RouteType {
	Bus = "BUS",
	StreetCar = "STREET_CAR",
	LightRail = "LIGHT_RAIL",
	Metro = "METRO",
}

interface Route {
	id: string;
	type: RouteType;
}

export default Route;
