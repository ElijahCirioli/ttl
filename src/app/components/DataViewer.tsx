"use client";

import { refreshProfile } from "@/actions/refreshCookies";
import Profile from "@/lib/models/Profile";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

interface DataViewerProps {
	profile: Profile;
}

const DataViewer: React.FC<DataViewerProps> = ({ profile }: DataViewerProps) => {
	const [socketConnected, setSocketConnected] = useState(false);

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
			setSocketConnected(true);
		}

		function onDisconnect() {
			setSocketConnected(false);
		}

		socket.on("connect", onConnect);
		socket.on("disconnect", onDisconnect);

		return () => {
			socket.off("connect", onConnect);
			socket.off("disconnect", onDisconnect);
		};
	}, [profile.id]);

	return (
		<div>
			<p>Status: {socketConnected ? "connected" : "disconnected"}</p>
			<p>Profile: {profile.id}</p>
		</div>
	);
};

export default DataViewer;
