import Stop from "./Stop";
import { Route } from "./Route";

interface StopService {
	stop: Stop;
	routes: Route[];
	latitude: number;
	longitude: number;
	distanceMeters: number;
}

export default StopService;
