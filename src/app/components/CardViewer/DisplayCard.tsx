"use client";

import { faChevronUp, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Arrival } from "@/lib/models/Arrival";
import Card from "@/lib/models/Card";
import DisplayCardRoute from "@/components/CardViewer/DisplayCardRoute";
import TransitIcon from "@/components/icons/TransitIcon";
import styles from "./DisplayCard.module.css";

interface DisplayCardProps {
	card: Card;
	arrivals: Arrival[];
	isEditing: boolean;
	deleteCard(): void;
}

const DisplayCard: React.FC<DisplayCardProps> = ({ card, arrivals, isEditing, deleteCard }: DisplayCardProps) => {
	const [collapsed, setCollapsed] = useState(false);

	// TODO: allow cards with multiple route types
	const baseRoute = card.routes[0];

	const arrivalsByRoute = Object.groupBy(arrivals, (arrival) => arrival.routeId);

	return (
		<div className={styles.displayCardWrap}>
			{isEditing && (
				<button className={styles.deleteButton} onClick={deleteCard}>
					<FontAwesomeIcon icon={faCircleXmark} />
				</button>
			)}
			<article className={`${styles.displayCard} ${isEditing && styles.editing}`}>
				<div className={styles.header} style={{ backgroundColor: baseRoute.color }}>
					<TransitIcon routeType={baseRoute.type} color="var(--white-color)" width={48} />
					<div className={styles.titleWrap}>
						<h3>{baseRoute.name}</h3>
						<p>At {card.stop.location}</p>
					</div>
					<button
						className={`${styles.collapseButton} ${collapsed ? styles.rotated : ""}`}
						onClick={() => setCollapsed(!collapsed)}
					>
						<FontAwesomeIcon icon={faChevronUp} />
					</button>
				</div>
				<div className={styles.contentWrap}>
					{card.routes.map((route) => (
						<DisplayCardRoute
							route={route}
							arrivals={arrivalsByRoute[route.id]?.toSorted((a, b) => a.time - b.time) ?? []}
							collapsed={collapsed}
							key={`${route.id}`}
						/>
					))}
				</div>
			</article>
		</div>
	);
};

export default DisplayCard;
