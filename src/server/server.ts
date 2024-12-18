import SQLite from "@/lib/db/SQLite";
import next from "next";
import { createServer } from "node:http";
import { Server, Socket } from "socket.io";

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

io.on("connection", (socket: Socket) => {
	const profile = socket.handshake.headers.profile as string | undefined;
	console.log(`Connection established with profile='${profile}'`);
	if (profile) {
		socket.join(profile);
	}
});

httpServer
	.once("error", (err) => {
		console.error(err);
		process.exit(1);
	})
	.listen(port, () => {
		console.log(`Server running on http://${hostname}:${port}`);
	});
