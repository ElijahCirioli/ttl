"use client";

import { faChevronUp, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import Arrival from "@/lib/models/Arrival";
import Card from "@/lib/models/Card";
import TransitIcon from "@/components/icons/TransitIcon";
import DisplayCardArrival from "./DisplayCardArrival";
import styles from "./DisplayCard.module.css";

interface DisplayCardProps {
	card: Card;
	arrivals: Arrival[];
	currentTime: number;
	isEditing: boolean;
	deleteCard(): void;
}

const DisplayCard: React.FC<DisplayCardProps> = ({
	card,
	arrivals,
	currentTime,
	isEditing,
	deleteCard,
}: DisplayCardProps) => {
	const [collapsed, setCollapsed] = useState(false);

	let arrivalElements = arrivals
		.toSorted((a, b) => a.time - b.time)
		.slice(0, collapsed ? 1 : 3)
		.filter((arrival) => arrival.time - currentTime < 12 * 60 * 60 * 1000)
		.map((arrival, i) => (
			<DisplayCardArrival
				destination={arrival.destination}
				currentTime={currentTime}
				arrivalTime={arrival.time}
				key={i}
			></DisplayCardArrival>
		));
	if (arrivalElements.length === 0) {
		arrivalElements = card.route.destinations
			.slice(0, collapsed ? 1 : 3)
			.map((destination, i) => (
				<DisplayCardArrival destination={destination} currentTime={currentTime} key={i}></DisplayCardArrival>
			));
	}

	// If there are no arrivals in the next 12 hours then fill in default data
	// if (arrivalTimes.length === 0) {
	// 	const destinations = [...new Set(card.routes.map((route) => route.destination))];
	// 	arrivalTimes = destinations.map((destination, i) => (
	// 		<div className={styles.arrival} key={i}>
	// 			No service
	// 			<p className={styles.arrivalDestination}>{destination}</p>
	// 		</div>
	// 	));
	// }

	return (
		<div className={styles.displayCardWrap}>
			{isEditing && (
				<button className={styles.deleteButton} onClick={deleteCard}>
					<FontAwesomeIcon icon={faCircleXmark} />
				</button>
			)}
			<article className={`${styles.displayCard} ${isEditing && styles.editing}`}>
				<div className={styles.header} style={{ backgroundColor: card.route.color }}>
					<TransitIcon routeType={card.route.type} color="var(--white-color)" width={48} />
					<div className={styles.titleWrap}>
						<h3>{card.route.name}</h3>
						<p>At {card.stop.location}</p>
					</div>
					<button
						className={`${styles.collapseButton} ${collapsed ? styles.rotated : ""}`}
						onClick={() => setCollapsed(!collapsed)}
					>
						<FontAwesomeIcon icon={faChevronUp} />
					</button>
				</div>
				<div className={styles.contentWrap}>{arrivalElements}</div>
			</article>
		</div>
	);
};

export default DisplayCard;
