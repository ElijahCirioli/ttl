"use client";

import { ReactElement, useEffect, useState } from "react";
import { Arrival } from "@/lib/models/Arrival";
import Route from "@/lib/models/Route";
import styles from "./DisplayCardRoute.module.css";

interface DisplayCardRouteProps {
	route: Route;
	arrivals: Arrival[];
	collapsed: boolean;
}

const DisplayCardRoute: React.FC<DisplayCardRouteProps> = ({ route, arrivals, collapsed }: DisplayCardRouteProps) => {
	const [currentTime, setCurrentTime] = useState(Date.now());

	useEffect(() => {
		// Update the current time every second so that we can update the cards without actually receiving fresh data
		const interval = setInterval(() => setCurrentTime(Date.now()), 1000);
		return () => {
			clearInterval(interval);
		};
	});

	// TODO: filter out really far away times and also handle when there are no results
	const relevantArrivals = collapsed ? arrivals.slice(0, 1) : arrivals.slice(0, 3);

	function arrivalTime(arrivalTime: number): ReactElement {
		const diffMinutes = Math.max(Math.round((arrivalTime - currentTime) / 60000), 0);
		if (diffMinutes < 60) {
			return (
				<p className={styles.arrivalTime}>
					{`${diffMinutes}`}
					<span className={styles.smallText}>min</span>
				</p>
			);
		}
		const diffHours = Math.floor(diffMinutes / 60);
		if (diffHours >= 12) {
			return <p className={styles.arrivalTime}>No service</p>;
		}

		return (
			<p className={styles.arrivalTime}>
				{`${diffHours}`}
				<span className={styles.smallText}>hr</span>
				{`${diffMinutes % 60}`}
				<span className={styles.smallText}>min</span>
			</p>
		);
	}

	return (
		<div className={styles.routeWrap}>
			{relevantArrivals.map((arrival, i) => (
				<div className={styles.arrival} key={i}>
					{arrivalTime(arrival.time)}
					<p className={styles.arrivalDestination}>{route.destination}</p>
				</div>
			))}
		</div>
	);
};

export default DisplayCardRoute;
