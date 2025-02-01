import next from "next";
import { createServer } from "node:http";
import { Server, Socket } from "socket.io";
import SQLite from "@/lib/db/SQLite";
import Profile from "@/lib/models/Profile";
import TriMet from "@/lib/transit/TriMet";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT ?? "3000", 10);
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

await app.prepare();

const httpServer = createServer(handler);
const io = new Server(httpServer);

const db = SQLite.default();
await db.init();
await db.createTables();

const transitService = TriMet.default();
const pollingInterval = 10000;

const activeProfiles = new Map<string, Profile>();

io.on("connection", async (socket: Socket) => {
	const profileId = socket.handshake.headers.profile as string | undefined;
	console.log(`Connection established with profileId='${profileId}'`);
	if (!profileId) {
		return;
	}
	socket.join(profileId);

	socket.on("disconnect", () => {
		console.log(`Connection lost with profileId='${profileId}'`);
		// No longer track transit updates for this room if no one is in it
		if (!io.sockets.adapter.rooms.get(profileId)) {
			console.log(`No connections remaining with profileId='${profileId}'`);
			activeProfiles.delete(profileId);
		}
	});

	const profile = await db.getProfile(profileId);
	if (!profile) {
		console.error(`[ERROR] Profile not found in database with profileId='${profileId}'`);
		return;
	}
	activeProfiles.set(profileId, profile);

	fetchTransitData(profile);
});

httpServer
	.once("error", (err) => {
		console.error(err);
		process.exit(1);
	})
	.listen(port, () => {
		console.log(`Server running on http://${hostname}:${port}`);
		setInterval(fetchAllTransitData, pollingInterval);
	});

async function fetchAllTransitData() {
	if (activeProfiles.size === 0) {
		return;
	}

	return Promise.all(Array.from(activeProfiles.values()).map(fetchTransitData));
}

async function fetchTransitData(profile: Profile) {
	return transitService
		.getArrivals(profile.cards.map((card) => card.stop))
		.then((arrivals) => {
			io.to(profile.id).emit("arrivals", Array.from(arrivals));
		})
		.catch((error) => {
			console.error(`[ERROR] Error fetching arrivals for profileId='${profile.id}': ${error}`);
		});
}
