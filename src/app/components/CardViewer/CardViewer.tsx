"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { refreshProfile } from "@/actions/refreshCookies";
import { Arrival } from "@/lib/models/Arrival";
import Card from "@/lib/models/Card";
import Profile from "@/lib/models/Profile";
import DisplayCard from "@/components/CardViewer/DisplayCard";
import SpinnerIcon from "@/components/icons/SpinnerIcon";
import styles from "./CardViewer.module.css";

interface CardViewerProps {
	profile: Profile;
	isEditing: boolean;
	editedCards: Card[];
	setEditedCards(cards: Card[]): void;
}

const CardViewer: React.FC<CardViewerProps> = ({
	profile,
	isEditing,
	editedCards,
	setEditedCards,
}: CardViewerProps) => {
	const [socketConnected, setSocketConnected] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | undefined>();
	const [arrivalsByStopId, setArrivalsByStopId] = useState(new Map<string, Arrival[]>());
	const [dataReceivedAt, setDataReceivedAt] = useState<number>();

	useEffect(() => {
		refreshProfile(profile.id);

		const socket = io({
			extraHeaders: {
				profile: profile.id,
			},
		});

		if (socket.connected) {
			onConnect();
		}

		function onConnect() {
			console.log("WebSocket connection established");
			setSocketConnected(true);
		}

		function onDisconnect() {
			console.log("WebSocket connection lost");
			setSocketConnected(false);
		}

		function onArrivals(arrivalsArr: [string, Arrival[]][]) {
			// TODO: add check for when we get unexpected arrivals. That likely means we need to refresh the profile
			const arrivals: Map<string, Arrival[]> = new Map(arrivalsArr);
			setArrivalsByStopId(arrivals);
			setDataReceivedAt(Date.now());
			setErrorMessage(undefined);
		}

		function onError(error: string) {
			setErrorMessage(error);
		}

		socket.on("connect", onConnect);
		socket.on("disconnect", onDisconnect);
		socket.on("arrivals", onArrivals);
		socket.on("error", onError);

		return () => {
			socket.off("connect", onConnect);
			socket.off("disconnect", onDisconnect);
			socket.off("arrivals", onArrivals);
			socket.off("error", onError);
		};
	}, [profile.id]);

	if (!socketConnected) {
		return (
			<div id={styles.loadingWrap}>
				<h2>Establishing connection with server...</h2>
				<SpinnerIcon scale={0.5} color={"var(--blue-color)"} />
			</div>
		);
	}

	if (profile.cards.length === 0) {
		// TODO: make this a nice experience
		return (
			<div id={styles.errorWrap}>
				<h2>No cards found for profile.</h2>
				<Link href="/add">Add transit stops</Link>
			</div>
		);
	}

	if (errorMessage) {
		return (
			<div id={styles.errorWrap}>
				<h2>Error from server</h2>
				<p>{errorMessage}</p>
			</div>
		);
	}

	// Ignore cached data when it is over 5 minutes old
	const dataIsStale = dataReceivedAt && Date.now() - dataReceivedAt > 300000;
	if (arrivalsByStopId.size === 0 || dataIsStale) {
		return (
			<div id={styles.loadingWrap}>
				<h2>Querying TriMet...</h2>
				<SpinnerIcon scale={0.5} color={"var(--blue-color)"} />
			</div>
		);
	}

	function deleteCard(card: Card) {
		setEditedCards(editedCards.filter((c) => c.stop.id !== card.stop.id));
	}

	const cards = isEditing ? editedCards : profile.cards;
	return (
		<div id={styles.cardsWrap}>
			{cards.map((card) => (
				<DisplayCard
					card={card}
					arrivals={arrivalsByStopId.get(card.stop.id) ?? []}
					isEditing={isEditing}
					deleteCard={() => deleteCard(card)}
					key={card.stop.id + card.routes.map((route) => route.id + route.destination).join("|")}
				/>
			))}
		</div>
	);
};

export default CardViewer;
