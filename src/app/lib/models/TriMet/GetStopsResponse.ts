interface GetStopsResponse {
	resultSet: SuccessResultSet | FailureResultSet;
}

interface SuccessResultSet {
	queryTime: string;
	location: Location[];
}

interface FailureResultSet {
	errorMessage: ErrorMessage;
}

interface ErrorMessage {
	content: string;
}

interface Location {
	locid: number;
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
