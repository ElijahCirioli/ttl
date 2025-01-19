import { Arrival } from "@/lib/models/Arrival";
import Stop from "@/lib/models/Stop";
import StopService from "@/lib/models/StopService";

// TODO: look into implementing this functionality via GTFS (https://gtfs.org)
interface TransitService {
	getStops(latitutde: number, longitude: number): Promise<StopService[]>;

	getArrivals(stops: Stop[]): Promise<Map<Stop, Arrival[]>>;
}

export default TransitService;
