"use client";

import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { addAndRemoveRoutes } from "@/actions/addAndRemoveRoutes";
import { getStops } from "@/actions/getStops";
import Profile from "@/lib/models/Profile";
import Route, { RouteId, RouteType } from "@/lib/models/Route";
import Stop, { StopId } from "@/lib/models/Stop";
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

	// Save the combinations of routes and stops that we are modifying as a tuple [stopId, routeId]
	const [routesToAddById, setRoutesToAddById] = useState<Map<StopId, Set<RouteId>>>(new Map());
	const [routesToRemoveById, setRoutesToRemoveById] = useState<Map<StopId, Set<RouteId>>>(new Map());
	const savedSelectedRoutesById = new Map(
		profile.cards.map((card) => [card.stop.id, new Set(card.routes.map((route) => route.id))])
	);

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

	function isRouteSelected(stopId: StopId, routeId: RouteId): boolean {
		return (
			(savedSelectedRoutesById.get(stopId)?.has(routeId) && !routesToRemoveById.get(stopId)?.has(routeId)) ||
			routesToAddById.get(stopId)?.has(routeId) === true
		);
	}

	function selectRoute(stopId: StopId, routeId: RouteId): void {
		const maybeRemoveStopRoutes = routesToRemoveById.get(stopId);
		if (maybeRemoveStopRoutes && maybeRemoveStopRoutes.has(routeId)) {
			routesToRemoveById.set(stopId, maybeRemoveStopRoutes.difference(new Set([routeId])));
			setRoutesToRemoveById(new Map(routesToRemoveById));
		} else {
			const addStopRoutes = routesToAddById.get(stopId) ?? new Set();
			routesToAddById.set(stopId, addStopRoutes.union(new Set([routeId])));
			setRoutesToAddById(new Map(routesToAddById));
		}
	}

	function unselectRoute(stopId: StopId, routeId: RouteId): void {
		const maybeAddStopRoutes = routesToAddById.get(stopId);
		if (maybeAddStopRoutes && maybeAddStopRoutes.has(routeId)) {
			routesToAddById.set(stopId, maybeAddStopRoutes.difference(new Set([routeId])));
			setRoutesToAddById(new Map(routesToAddById));
		} else {
			const removeStopRoutes = routesToRemoveById.get(stopId) ?? new Set();
			routesToRemoveById.set(stopId, (removeStopRoutes ?? new Set()).union(new Set([routeId])));
			setRoutesToRemoveById(new Map(routesToRemoveById));
		}
	}

	function toggleFilter(routeType: RouteType): void {
		const newFilters = new Map(filters);
		newFilters.set(routeType, !filters.get(routeType));
		setFilters(newFilters);
	}

	const filteredStops = stops.flatMap((stopService) => {
		const filteredRoutes = stopService.routes.filter(
			(route) => isRouteSelected(stopService.stop.id, route.id) || filters.get(route.type)
		);
		if (filteredRoutes.length === 0) {
			return [];
		}
		return [{ ...stopService, routes: filteredRoutes }];
	});

	function submit() {
		if (stops === null) {
			return;
		}
		const routesById = new Map<StopId, Map<RouteId, [Stop, Route]>>(
			stops.map((stopService) => [
				stopService.stop.id,
				new Map(stopService.routes.map((route) => [route.id, [stopService.stop, route]])),
			])
		);
		const routesToAdd = Array.from(routesToAddById)
			.flatMap(([stopId, routeIds]) =>
				Array.from(routeIds).map((routeId) => routesById.get(stopId)?.get(routeId))
			)
			.filter((route) => route !== undefined);
		const routesToRemove = Array.from(routesToRemoveById)
			.flatMap(([stopId, routeIds]) =>
				Array.from(routeIds).map((routeId) => routesById.get(stopId)?.get(routeId))
			)
			.filter((route) => route !== undefined);

		addAndRemoveRoutes(profile.id, routesToAdd, routesToRemove);
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
