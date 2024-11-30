"use client";

import { getStops } from "@/actions/getStops";
import StopService from "@/lib/models/StopService";
import Profile from "@/lib/models/Profile";
import { useEffect, useState } from "react";
import styles from "./StopBrowser.module.css";
import StopRow from "./StopRow";

interface StopBrowserProps {
	profile: Profile;
}

const StopBrowser: React.FC<StopBrowserProps> = ({ profile }: StopBrowserProps) => {
	const [stops, setStops] = useState<StopService[] | null>(null);

	useEffect(() => {
		navigator.geolocation.getCurrentPosition((pos) => {
			getStops(pos.coords.latitude, pos.coords.longitude)
				.then((localStops) => setStops(localStops))
				.catch((err) => console.error("Failed to get local stops", err));
		});
	}, []);

	if (stops === null) {
		return <p>Querying Trimet...</p>;
	}

	return (
		<div id={styles.stopsWrap}>
			{stops.map((s) => (
				<StopRow stopService={s} key={s.stop.id} />
			))}
		</div>
	);
};

export default StopBrowser;
