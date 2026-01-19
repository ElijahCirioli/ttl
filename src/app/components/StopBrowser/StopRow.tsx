"use client";

import { faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import Route, { RouteId } from "@/lib/models/Route";
import { StopId } from "@/lib/models/Stop";
import StopService from "@/lib/models/StopService";
import StopRowRoute from "./StopRowRoute";
import styles from "./StopRow.module.css";

interface StopRowProps {
	stopService: StopService;
	isRouteSelected(stopId: StopId, routeId: RouteId): boolean;
	selectRoute(stopId: StopId, routeId: RouteId): void;
	unselectRoute(stopId: StopId, routeId: RouteId): void;
}

const StopRow: React.FC<StopRowProps> = ({
	stopService,
	isRouteSelected,
	selectRoute,
	unselectRoute,
}: StopRowProps) => {
	const [collapsed, setCollapsed] = useState(false);

	// TODO: support metric output
	const distanceMiles = (stopService.distanceMeters / 1609).toFixed(1);
	const stopLocationStr = stopService.stop.direction
		? `(${stopService.stop.direction}, ${distanceMiles} miles away)`
		: `(${distanceMiles} miles)`;

	return (
		<article className={styles.stopService}>
			<h3 className={styles.stopTitle} onClick={() => setCollapsed(!collapsed)}>
				<FontAwesomeIcon
					icon={faChevronUp}
					className={`${styles.collapseIcon} ${collapsed ? styles.rotated : ""}`}
				/>
				{stopService.stop.location}
				<span className={styles.stopTitleLocation}>{stopLocationStr}</span>
			</h3>
			<div className={`${styles.routesWrap} ${collapsed ? styles.hidden : ""}`}>
				{stopService.routes.map((route) => (
					<StopRowRoute
						key={route.id}
						route={route}
						isChecked={isRouteSelected(stopService.stop.id, route.id)}
						toggleChecked={() => {
							if (isRouteSelected(stopService.stop.id, route.id)) {
								unselectRoute(stopService.stop.id, route.id);
							} else {
								selectRoute(stopService.stop.id, route.id);
							}
						}}
					/>
				))}
			</div>
		</article>
	);
};

export default StopRow;
