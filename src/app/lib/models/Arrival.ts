export enum ArrivalStatus {
	Scheduled = "Scheduled",
	Tracked = "Tracked",
	Delayed = "Delayed",
	Cancelled = "Cancelled",
}

export interface Arrival {
	stopId: string;
	routeId: string;
	time: number;
	status: ArrivalStatus;
	alert?: string;
}
