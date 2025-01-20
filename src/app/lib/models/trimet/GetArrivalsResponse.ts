interface GetArrivalsResponse {
	resultSet: SuccessResultSet | FailureResultSet;
}

interface SuccessResultSet {
	queryTime: string;
	arrival: Arrival[];
	detour?: Detour[];
}

interface FailureResultSet {
	errorMessage: ErrorMessage;
}

interface ErrorMessage {
	content: string;
}

interface Arrival {
	id: string;
	blockID: string;
	vehicleID: string;
	tripID: string;
	locid: number;
	departed: boolean;
	detoured: boolean;
	detour?: number[];
	dir: number;
	scheduled: number;
	estimated?: number;
	feet: number;
	shortSign: string;
	fullSign: string;
	route: number;
	showMilesAway: boolean;
	routeColor: string;
	newTrip: boolean;
	replacedService?: true;
	piece: string;
	trackingError?: TrackingError;
	status: Status;
	reason?: string;
}

type Status = "estimated" | "scheduled" | "delayed" | "canceled";

interface TrackingError {
	timestamp: string;
	offRoute?: boolean;
}

interface Detour {
	id: number;
	begin: string;
	end: string;
	desc: string;
	header_text?: string;
	info_link_url?: string;
	system_wide_flag: boolean;
}

export default GetArrivalsResponse;
