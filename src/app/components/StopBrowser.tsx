"use client";

import { getStops } from "@/actions/getStops";
import StopService from "@/lib/models/StopService";
import { useEffect, useState } from "react";

const StopBrowser: React.FC = () => {
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
		<div>
			<h1>STOPS:</h1>
			<div>
				{stops.map((s) => (
					<p key={s.stop.id}>{s.stop.location}</p>
				))}
			</div>
		</div>
	);
};

export default StopBrowser;
