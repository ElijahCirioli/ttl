import { Route } from "./Route";
import Stop from "./Stop";

interface StopService {
	stop: Stop;
	routes: Route[];
	latitude: number;
	longitude: number;
	distanceMeters: number;
}

export default StopService;
