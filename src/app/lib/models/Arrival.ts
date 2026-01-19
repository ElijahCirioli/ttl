export enum ArrivalStatus {
	Scheduled = "Scheduled",
	Tracked = "Tracked",
	Delayed = "Delayed",
	Cancelled = "Cancelled",
}

interface Arrival {
	stopId: string;
	routeId: string;
	destination: string;
	time: number;
	status: ArrivalStatus;
	alert?: string;
}

export default Arrival;
