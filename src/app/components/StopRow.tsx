"use client";

import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Route } from "@/lib/models/Route";
import StopService from "@/lib/models/StopService";
import StopRowRoute from "./StopRowRoute";
import styles from "./StopRow.module.css";

interface StopRowProps {
	stopService: StopService;
	isRouteSelected(route: Route): boolean;
	selectRoute(route: Route): void;
	unselectRoute(route: Route): void;
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
		? `(${stopService.stop.direction}, ${distanceMiles} miles)`
		: `(${distanceMiles} miles)`;

	const routesById = new Map<string, Route[]>();
	for (const route of stopService.routes) {
		if (!routesById.has(route.id)) {
			routesById.set(route.id, [route]);
		} else {
			routesById.get(route.id)?.push(route);
		}
	}

	return (
		<article className={styles.stopService}>
			<h3 className={styles.stopTitle} onClick={() => setCollapsed(!collapsed)}>
				<FontAwesomeIcon icon={collapsed ? faChevronDown : faChevronUp} className={styles.collapseIcon} />
				{stopService.stop.location}
				<span className={styles.stopTitleLocation}>{stopLocationStr}</span>
			</h3>
			<div className={`${styles.routesWrap} ${collapsed ? styles.hidden : ""}`}>
				{routesById.entries().map(([routeId, routes]) => {
					const destinations = routes.map((route) => {
						return {
							name: route.destination,
							isChecked: isRouteSelected(route),
							toggledChecked: () => {
								// TODO: make this less dumb
								if (isRouteSelected(route)) {
									unselectRoute(route);
								} else {
									selectRoute(route);
								}
							},
						};
					});
					return <StopRowRoute key={routeId} route={routes[0]} destinations={destinations} />;
				})}
			</div>
		</article>
	);
};

export default StopRow;
