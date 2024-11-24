import StopService from "@/lib/models/StopService";

interface TransitService {
	getStops(latitutde: number, longitude: number): Promise<StopService[]>;
}

export default TransitService;
