"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import StopService from "@/lib/models/StopService";
import styles from "./StopRow.module.css";
import { Route, RouteType } from "@/lib/models/Route";
import StopRowRoute from "./StopRowRoute";

interface StopRowProps {
	stopService: StopService;
}

const StopRow: React.FC<StopRowProps> = ({ stopService }: StopRowProps) => {
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
			<h3 className={styles.stopTitle} onClick={(e) => setCollapsed(!collapsed)}>
				<FontAwesomeIcon icon={collapsed ? faChevronDown : faChevronUp} className={styles.collapseIcon} />
				{stopService.stop.location}
				<span className={styles.stopTitleLocation}>{stopLocationStr}</span>
			</h3>
			<div className={`${styles.routesWrap} ${collapsed ? styles.hidden : ""}`}>
				{routesById.entries().map(([routeId, routes]) => {
					const destinations = routes.map((route) => route.destination);
					return (
						<StopRowRoute
							key={routeId}
							id={routeId}
							routeType={routes[0].type}
							routeDisplayType={routes[0].displayType}
							destinations={destinations}
						/>
					);
				})}
			</div>
		</article>
	);
};

export default StopRow;
