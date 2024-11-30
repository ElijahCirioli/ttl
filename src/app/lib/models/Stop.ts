export enum StopDirection {
	Northbound = "Northbound",
	Southbound = "Southbound",
	Eastbound = "Eastbound",
	Westbound = "Westbound",
}

interface Stop {
	id: string;
	location: string;
	direction?: StopDirection;
}

export default Stop;
