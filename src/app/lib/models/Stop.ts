export enum StopDirection {
	Northbound = "Northbound",
	Southbound = "Southbound",
	Eastbound = "Eastbound",
	Westbound = "Westbound",
}

export type StopId = string;

interface Stop {
	id: StopId;
	location: string;
	direction?: StopDirection;
}

export default Stop;
