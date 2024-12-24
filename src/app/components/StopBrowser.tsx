"use client";

import { useEffect, useState } from "react";
import styles from "./StopBrowser.module.css";
import StopRow from "./StopRow";
import { getStops } from "@/actions/getStops";
import StopService from "@/lib/models/StopService";
import Profile from "@/lib/models/Profile";
import { Route } from "@/lib/models/Route";

interface StopBrowserProps {
	profile: Profile;
}

const StopBrowser: React.FC<StopBrowserProps> = ({ profile }: StopBrowserProps) => {
	const [stops, setStops] = useState<StopService[] | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const savedSelectedRoutes = new Set(profile.cards.flatMap((card) => card.routes));
	const [selectedRoutes, setSelectedRoutes] = useState<Set<Route>>(savedSelectedRoutes);

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(
			(pos) => {
				getStops(pos.coords.latitude, pos.coords.longitude)
					.then((localStops) => {
						if (localStops.length > 0) {
							setStops(localStops);
						} else {
							setErrorMessage("No stops found near your current location.");
						}
					})
					.catch((err) => {
						const errMessage = "Failed to get local stops from Trimet.";
						console.error(errMessage, err);
						setErrorMessage(errMessage);
					});
			},
			(err) => {
				const errMessage = "Failed to get current location. Allow TTL to access your location and try again.";
				console.error(errMessage, err);
				setErrorMessage(errMessage);
			}
		);
	}, []);

	if (errorMessage !== null) {
		return <p>{errorMessage}</p>;
	}

	if (stops === null) {
		return <p>Querying Trimet...</p>;
	}

	function isRouteSelected(route: Route): boolean {
		return selectedRoutes.has(route);
	}

	function selectRoute(route: Route): void {
		setSelectedRoutes(selectedRoutes.union(new Set([route])));
	}

	function unselectRoute(route: Route): void {
		setSelectedRoutes(selectedRoutes.difference(new Set([route])));
	}

	return (
		<div id={styles.stopsWrap}>
			{stops.map((s) => (
				<StopRow
					stopService={s}
					key={s.stop.id}
					isRouteSelected={isRouteSelected}
					selectRoute={selectRoute}
					unselectRoute={unselectRoute}
				/>
			))}
		</div>
	);
};

export default StopBrowser;
