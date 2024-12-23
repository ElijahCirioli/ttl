"use client";

import { Route } from "@/lib/models/Route";
import { TransitIcon } from "@/components/icons/TransitIcon";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./StopRowRoute.module.css";

interface StopRowRouteProps {
	route: Route;
	destinations: SelectableDestination[];
}

interface SelectableDestination {
	name: string;
	isChecked: boolean;
	toggledChecked(): void;
}

const StopRowRoute: React.FC<StopRowRouteProps> = ({ route, destinations }: StopRowRouteProps) => {
	return (
		<div className={styles.route}>
			<div className={styles.routeTitle}>
				<TransitIcon routeType={route.type} color={route.color ?? "black"} width={36} />
				<h4>{route.name}</h4>
			</div>
			<div className={styles.destinationsWrap}>
				{destinations.map((dest) => (
					<label className={styles.destination} key={dest.name}>
						<button
							className={`${styles.checkBox} ${dest.isChecked ? styles.checked : ""}`}
							onClick={dest.toggledChecked}
						>
							<span className={styles.checkMark}>
								<FontAwesomeIcon icon={faCheck} />
							</span>
						</button>
						{dest.name}
					</label>
				))}
			</div>
		</div>
	);
};

export default StopRowRoute;
