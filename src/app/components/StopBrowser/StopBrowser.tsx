"use client";

import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { getStops } from "@/actions/getStops";
import { putCards } from "@/actions/putCards";
import Card from "@/lib/models/Card";
import Profile from "@/lib/models/Profile";
import { RouteId, RouteType } from "@/lib/models/Route";
import { StopId } from "@/lib/models/Stop";
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
	const [coordinatesMessage, setCoordinatesMessage] = useState<string | null>(null);
	const [filters, setFilters] = useState<Map<RouteType, boolean>>(new Map());
	const [updatedCardIds, setUpdatedCardIds] = useState<[StopId, RouteId][]>(
		profile.cards.map((card) => [card.stop.id, card.route.id])
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
							setCoordinatesMessage(`${localStops.length} TriMet stops found near (${pos.coords.latitude} lat,
									${pos.coords.longitude} long)`);
							setErrorMessage(null);
						} else {
							setCoordinatesMessage(null);
							setErrorMessage("No stops found near your current location.");
						}
					})
					.catch((err) => {
						const errMessage = "Failed to get nearby stops from TriMet.";
						console.error(errMessage, err);
						setErrorMessage(errMessage);
						setCoordinatesMessage(null);
					});
			},
			(err) => {
				const errMessage = "Failed to get current location. Allow TTL to access your location and try again.";
				console.error(errMessage, err);
				setErrorMessage(errMessage);
			},
			{ enableHighAccuracy: true }
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
		return !!updatedCardIds.find(([cardStopId, cardRouteId]) => cardStopId === stopId && cardRouteId === routeId);
	}

	function selectRoute(stopId: StopId, routeId: RouteId): void {
		if (!isRouteSelected(stopId, routeId)) {
			setUpdatedCardIds([...updatedCardIds, [stopId, routeId]]);
		}
	}

	function unselectRoute(stopId: StopId, routeId: RouteId): void {
		setUpdatedCardIds(
			updatedCardIds.filter(([cardStopId, cardRouteId]) => cardStopId !== stopId || cardRouteId !== routeId)
		);
	}

	function toggleFilter(routeType: RouteType): void {
		const newFilters = new Map(filters);
		newFilters.set(routeType, !filters.get(routeType));
		setFilters(newFilters);
	}

	function submit() {
		if (stops === null) {
			return;
		}

		const updatedCards = updatedCardIds
			.map(([stopId, routeId]) => buildCard(stopId, routeId))
			.filter((card) => card !== undefined);

		// Recalculate which cards will appear identical and therefore require disambiguation
		Object.values(Object.groupBy(updatedCards, (card) => `${card.stop.location} | ${card.route.name}`)).forEach(
			(identicalCards) =>
				identicalCards?.forEach((card) => (card.disambiguationRequired = identicalCards.length > 1))
		);

		putCards(profile.id, updatedCards);
	}

	function buildCard(stopId: StopId, routeId: RouteId): Card | undefined {
		const stopService = stops?.find((stopService) => stopService.stop.id === stopId);
		const route = stopService?.routes.find((route) => route.id === routeId);
		if (route && stopService) {
			// Even if this card already exists in the profile we would rather redefine it in order to populate new information
			return {
				stop: stopService.stop,
				route: route,
				disambiguationRequired: false,
			};
		} else {
			return profile.cards.find((card) => card.stop.id === stopId && card.route.id === routeId);
		}
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

	return (
		<>
			<div id={styles.controlsWrap}>
				<FiltersPanel filters={filters} toggleFilter={toggleFilter} />
				<div id={styles.submitButtonsWrap}>
					<button id={styles.cancelButton} onClick={() => redirect("/")}>
						Cancel
					</button>
					<button id={styles.submitButton} onClick={submit}>
						Save selections
					</button>
				</div>
			</div>
			{coordinatesMessage ? <p id={styles.coordinates}>{coordinatesMessage}</p> : {}}
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
