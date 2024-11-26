interface GetStopsResponse {
	resultSet: ResultSet;
}

interface ResultSet {
	queryTime: string;
	location: Location[];
}

interface Location {
	locid: string;
	lat: number;
	lng: number;
	metersDistance: number;
	feetDistance: number;
	dir: string;
	desc: string;
	route: Route[];
}

interface Route {
	route: number;
	routeColor: string;
	type: string;
	routeSubType: string;
	desc: string;
	dir: Dir[];
}

interface Dir {
	dir: number;
	desc: string;
}

export default GetStopsResponse;
