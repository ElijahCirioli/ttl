"use client";

import { faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import Card from "@/lib/models/Card";
import TransitIcon from "@/components/icons/TransitIcon";
import styles from "./DisplayCard.module.css";

interface DisplayCardProps {
	card: Card;
}

const DisplayCard: React.FC<DisplayCardProps> = ({ card }: DisplayCardProps) => {
	const [collapsed, setCollapsed] = useState(false);

	// TODO: allow cards with multiple route types
	const baseRoute = card.routes[0];

	return (
		<article className={styles.displayCard}>
			<div className={styles.header} style={{ backgroundColor: baseRoute.color }}>
				<TransitIcon routeType={baseRoute.type} color="var(--white-color)" width={48} />
				<div className={styles.titleWrap}>
					<h3>{baseRoute.name}</h3>
					<p>At {card.stop.location}</p>
				</div>
				<FontAwesomeIcon
					icon={faChevronUp}
					className={`${styles.collapseIcon} ${collapsed ? styles.rotated : ""}`}
				/>
			</div>
			<div className={styles.contentWrap}></div>
		</article>
	);
};

export default DisplayCard;
