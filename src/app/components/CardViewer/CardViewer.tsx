"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { refreshProfile } from "@/actions/refreshCookies";
import { Arrival } from "@/lib/models/Arrival";
import Profile from "@/lib/models/Profile";
import Stop from "@/lib/models/Stop";
import DisplayCard from "@/components/CardViewer/DisplayCard";
import SpinnerIcon from "@/components/icons/SpinnerIcon";
import styles from "./CardViewer.module.css";

interface CardViewerProps {
	profile: Profile;
}

const CardViewer: React.FC<CardViewerProps> = ({ profile }: CardViewerProps) => {
	const [socketConnected, setSocketConnected] = useState(false);
	const [arrivalsByStop, setArrivalsByStop] = useState(new Map<Stop, Arrival[]>());
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

		function onArrivals(arrivalsArr: [Stop, Arrival[]][]) {
			const arrivals: Map<Stop, Arrival[]> = new Map(arrivalsArr);
			console.log("Received arrival data:", Array.from(arrivals.values()));
			setArrivalsByStop(arrivals);
			setDataReceivedAt(Date.now());
		}

		socket.on("connect", onConnect);
		socket.on("disconnect", onDisconnect);
		socket.on("arrivals", onArrivals);

		return () => {
			socket.off("connect", onConnect);
			socket.off("disconnect", onDisconnect);
			socket.off("arrivals", onArrivals);
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

	// Ignore cached data when it is over 5 minutes old
	const dataIsStale = dataReceivedAt && Date.now() - dataReceivedAt > 300000;
	if (arrivalsByStop.size === 0 || dataIsStale) {
		return (
			<div id={styles.loadingWrap}>
				<h2>Querying TriMet...</h2>
				<SpinnerIcon scale={0.5} color={"var(--blue-color)"} />
			</div>
		);
	}

	return (
		<div id={styles.cardsWrap}>
			{profile.cards.map((card) => (
				<DisplayCard card={card} key={card.stop.id} />
			))}
		</div>
	);
};

export default CardViewer;
