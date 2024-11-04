"use client";

import { refreshProfile } from "@/actions/refreshCookies";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

interface DataViewerProps {
	profile: string;
}

const DataViewer: React.FC<DataViewerProps> = ({ profile }: DataViewerProps) => {
	const [socketConnected, setSocketConnected] = useState(false);

	useEffect(() => {
		refreshProfile(profile);

		const socket = io({
			extraHeaders: {
				profile: profile,
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
	}, [profile]);

	return (
		<div>
			<p>Status: {socketConnected ? "connected" : "disconnected"}</p>
			<p>Profile: {profile}</p>
		</div>
	);
};

export default DataViewer;
