import styles from "./DisplayCardArrival.module.css";

interface DisplayCardArrivalProps {
	destination: string;
	currentTime: number;
	arrivalTime?: number;
}

const DisplayCardArrival: React.FC<DisplayCardArrivalProps> = ({
	destination,
	currentTime,
	arrivalTime,
}: DisplayCardArrivalProps) => {
	let timeToArrival = <p className={styles.arrivalTime}>None</p>;
	if (arrivalTime) {
		const diffMinutes = Math.max(Math.round((arrivalTime - currentTime) / 60000), 0);
		if (diffMinutes < 60) {
			timeToArrival = (
				<p className={styles.arrivalTime}>
					{`${diffMinutes}`}
					<span className={styles.smallText}>min</span>
				</p>
			);
		} else {
			const diffHours = Math.floor(diffMinutes / 60);
			timeToArrival = (
				<p className={styles.arrivalTime}>
					{`${diffHours}`}
					<span className={styles.smallText}>hr</span>
					{`${diffMinutes % 60}`}
					<span className={styles.smallText}>min</span>
				</p>
			);
		}
	}

	return (
		<div className={styles.arrival}>
			{timeToArrival}
			<p className={styles.arrivalDestination}>{destination}</p>
		</div>
	);
};

export default DisplayCardArrival;
