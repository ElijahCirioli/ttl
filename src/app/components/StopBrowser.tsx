"use client";

import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { getStops } from "@/actions/getStops";
import Profile from "@/lib/models/Profile";
import { Route, RouteType } from "@/lib/models/Route";
import StopService from "@/lib/models/StopService";
import SpinnerIcon from "@/components/icons/SpinnerIcon";
import FiltersPanel from "./FiltersPanel";
import StopRow from "./StopRow";
import styles from "./StopBrowser.module.css";

interface StopBrowserProps {
	profile: Profile;
}

const StopBrowser: React.FC<StopBrowserProps> = ({ profile }: StopBrowserProps) => {
	const [stops, setStops] = useState<StopService[] | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [filters, setFilters] = useState<Map<RouteType, boolean>>(new Map());

	const savedSelectedRoutes = new Set(profile.cards.flatMap((card) => card.routes));
	const [selectedRoutes, setSelectedRoutes] = useState<Set<Route>>(savedSelectedRoutes);

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(
			(pos) => {
				getStops(pos.coords.latitude, pos.coords.longitude)
					.then((localStops) => {
						if (localStops.length > 0) {
							setStops(localStops);
							const routeTypes = Array.from(
								new Set(localStops.flatMap((stop) => stop.routes.map((route) => route.type)))
							);
							setFilters(new Map(routeTypes.map((routeType) => [routeType, true])));
						} else {
							setErrorMessage("No stops found near your current location.");
						}
					})
					.catch((err) => {
						const errMessage = "Failed to get nearby stops from Trimet.";
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
		return (
			<h2>
				<span className={styles.errorIcon}>
					<FontAwesomeIcon icon={faCircleExclamation} />
				</span>{" "}
				{errorMessage}
			</h2>
		);
	}

	if (stops === null) {
		return (
			<div id={styles.loadingWrap}>
				<h2>Querying Trimet...</h2>
				<SpinnerIcon scale={0.5} color={"var(--blue-color)"} />
			</div>
		);
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

	function toggleFilter(routeType: RouteType): void {
		const newFilters = new Map(filters);
		newFilters.set(routeType, !filters.get(routeType));
		setFilters(newFilters);
	}

	const filteredStops = stops.flatMap((stop) => {
		const filteredRoutes = stop.routes.filter((route) => isRouteSelected(route) || filters.get(route.type));
		if (filteredRoutes.length === 0) {
			return [];
		}
		return [{ ...stop, routes: filteredRoutes }];
	});

	return (
		<>
			<div id={styles.controlsWrap}>
				<FiltersPanel filters={filters} toggleFilter={toggleFilter} />
			</div>
			{filteredStops.length === 0 ? (
				<h2>No nearby stops match your filter criteria.</h2>
			) : (
				<div id={styles.stopsWrap}>
					{filteredStops.map((s) => (
						<StopRow
							stopService={s}
							key={s.stop.id}
							isRouteSelected={isRouteSelected}
							selectRoute={selectRoute}
							unselectRoute={unselectRoute}
						/>
					))}
				</div>
			)}
		</>
	);
};

export default StopBrowser;
