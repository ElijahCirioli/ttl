"use client";

import { Route } from "@/lib/models/Route";
import { TransitIcon } from "@/components/icons/TransitIcon";
import styles from "./StopRowRoute.module.css";

interface StopRowRouteProps {
	route: Route;
	destinations: string[];
}

const StopRowRoute: React.FC<StopRowRouteProps> = ({ route, destinations }: StopRowRouteProps) => {
	return (
		<div className={styles.route}>
			<div className={styles.routeTitle}>
				<TransitIcon routeType={route.type} color={route.color ?? "black"} width={30} />
				<h4>{route.name}</h4>
			</div>
			<div className={styles.destinationsWrap}>
				{destinations.map((dest) => (
					<div key={dest}>{dest}</div>
				))}
			</div>
		</div>
	);
};

export default StopRowRoute;
