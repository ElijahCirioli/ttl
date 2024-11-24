import Stop from "./Stop";
import Route from "./Route";

interface StopService {
	stop: Stop;
	latitude: number;
	longitude: number;
	routes: Route[];
}

export default StopService;
