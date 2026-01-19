import Route from "./Route";
import Stop from "./Stop";

interface Card {
	stop: Stop;
	route: Route;
	disambiguationRequired: boolean;
}

export default Card;
