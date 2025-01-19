"use client";

import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { submitStops } from "@/actions/addStops";
import { getStops } from "@/actions/getStops";
import Profile from "@/lib/models/Profile";
import { Route, RouteType } from "@/lib/models/Route";
import StopService from "@/lib/models/StopService";
import StopRow from "@/components/StopBrowser/StopRow";
import SpinnerIcon from "@/components/icons/SpinnerIcon";
import FiltersPanel from "./FiltersPanel";
import styles from "./StopBrowser.module.css";

interface StopBrowserProps {
	profile: Profile;
}

const StopBrowser: React.FC<StopBrowserProps> = ({ profile }: StopBrowserProps) => {
	const [stops, setStops] = useState<StopService[] | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [filters, setFilters] = useState<Map<RouteType, boolean>>(new Map());

	// TODO: make this consider stops
	const savedSelectedRoutes = new Set(profile.cards.flatMap((card) => card.routes));
	const [selectedRoutes, setSelectedRoutes] = useState<Set<Route>>(savedSelectedRoutes);

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(
			(pos) => {
				getStops(pos.coords.latitude, pos.coords.longitude)
					.then((localStops) => {
						if (localStops.length > 0) {
							const routeTypes = Array.from(
								new Set(localStops.flatMap((stop) => stop.routes.map((route) => route.type)))
							);
							setFilters(new Map(routeTypes.map((routeType) => [routeType, true])));
							setStops(localStops);
						} else {
							setErrorMessage("No stops found near your current location.");
						}
					})
					.catch((err) => {
						const errMessage = "Failed to get nearby stops from TriMet.";
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
				<h2>Querying TriMet...</h2>
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

	function submit() {
		if (stops === null) {
			return;
		}
		// TODO: make this less ugly
		const existingRouteIdsByStopId = new Map(
			profile.cards.map((card) => [card.stop.id, new Set(card.routes.map((route) => route.id))])
		);
		const cardsToAdd = stops.flatMap((stopService) => {
			const existingRouteIds = existingRouteIdsByStopId.get(stopService.stop.id) ?? new Set();
			const routesToAdd = stopService.routes.filter(
				(route) => isRouteSelected(route) && !existingRouteIds.has(route.id)
			);
			if (routesToAdd.length === 0) {
				return [];
			}
			return [{ stop: stopService.stop, routes: routesToAdd }];
		});

		const cardsToRemove = profile.cards.flatMap((card) => {
			const routesToRemove = card.routes.filter((route) => !isRouteSelected(route));
			if (routesToRemove.length === 0) {
				return [];
			}
			return [{ ...card, routes: routesToRemove }];
		});
		submitStops(profile.id, cardsToAdd, cardsToRemove);
	}

	return (
		<>
			<div id={styles.controlsWrap}>
				<FiltersPanel filters={filters} toggleFilter={toggleFilter} />
				<button id={styles.submitButton} onClick={submit}>
					Save selections
				</button>
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
