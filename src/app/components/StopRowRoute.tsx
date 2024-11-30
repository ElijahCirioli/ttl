"use client";

import { RouteType } from "@/lib/models/Route";
import styles from "./StopRowRoute.module.css";

interface StopRowRouteProps {
	id: string;
	routeType: RouteType;
	routeDisplayType: string;
	destinations: string[];
}

const StopRowRoute: React.FC<StopRowRouteProps> = ({
	id,
	routeType,
	routeDisplayType,
	destinations,
}: StopRowRouteProps) => {
	return (
		<div className={styles.route}>
			<h4>
				{id} {routeDisplayType}
			</h4>
			{destinations.map((dest) => (
				<div key={dest}>{dest}</div>
			))}
		</div>
	);
};

export default StopRowRoute;
