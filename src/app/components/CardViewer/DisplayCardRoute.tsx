"use client";

import { Arrival } from "@/lib/models/Arrival";
import { Route } from "@/lib/models/Route";
import styles from "./DisplayCardRoute.module.css";

interface DisplayCardRouteProps {
	route: Route;
	arrivals: Arrival[];
	collapsed: boolean;
}

const DisplayCardRoute: React.FC<DisplayCardRouteProps> = ({ route, arrivals, collapsed }: DisplayCardRouteProps) => {
	const relevantArrivals = collapsed ? arrivals.slice(0, 1) : arrivals.slice(0, 3);

	function prettyTime(arrivalTime: number): string {
		const diffMinutes = Math.round((arrivalTime - Date.now()) / 60000);
		if (diffMinutes < 60) {
			return `${diffMinutes}min`;
		}
		const diffHours = Math.floor(diffMinutes / 60);
		return `${diffHours}hr${diffMinutes % 60}min`;
	}

	return (
		<div className={styles.routeWrap}>
			{relevantArrivals.map((arrival) => (
				<div className={styles.arrival} key={arrival.time}>
					<p className={styles.arrivalTime}>{prettyTime(arrival.time)}</p>
					<p className={styles.arrivalDestination}>{route.destination}</p>
				</div>
			))}
		</div>
	);
};

export default DisplayCardRoute;
