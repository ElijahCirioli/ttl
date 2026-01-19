"use client";

import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Route from "@/lib/models/Route";
import TransitIcon from "@/components/icons/TransitIcon";
import styles from "./StopRowRoute.module.css";

interface StopRowRouteProps {
	route: Route;
	isChecked: boolean;
	toggleChecked(): void;
}

const StopRowRoute: React.FC<StopRowRouteProps> = ({ route, isChecked, toggleChecked }: StopRowRouteProps) => {
	return (
		<div className={styles.route}>
			<button className={`${styles.checkBox} ${isChecked ? styles.checked : ""}`} onClick={toggleChecked}>
				<span className={styles.checkMark}>
					<FontAwesomeIcon icon={faCheck} />
				</span>
			</button>
			<TransitIcon routeType={route.type} color={route.color ?? "black"} width={36} />
			<h4>{route.name}</h4>
			<p>{route.destinations.join(", ")}</p>
		</div>
	);
};

export default StopRowRoute;
