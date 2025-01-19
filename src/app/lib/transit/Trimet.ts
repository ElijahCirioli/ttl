import assert from "node:assert";
import { Arrival, ArrivalStatus } from "@/lib/models/Arrival";
import { Route, RouteType } from "@/lib/models/Route";
import Stop, { StopDirection } from "@/lib/models/Stop";
import StopService from "@/lib/models/StopService";
import GetArrivalsResponse from "@/lib/models/TriMet/GetArrivalsResponse";
import GetStopsResponse from "@/lib/models/TriMet/GetStopsResponse";
import TransitService from "./TransitService";

// https://developer.trimet.org/
class TriMet implements TransitService {
	private BASE_URL = "https://developer.trimet.org/ws/";

	private appId: string;

	constructor(appId: string) {
		this.appId = appId;
	}

	private async makeRequest<T>(path: string, queryParameters: Map<string, string>): Promise<T> {
		let url = `${this.BASE_URL}${path}?appId=${this.appId}`;
		for (const [key, val] of queryParameters) {
			url += `&${key}=${val}`;
		}
		const response = await fetch(url);
		const json = await response.json();
		return json as T;
	}

	private routeSubTypeConverter(subtype: string): RouteType {
		const mappings = new Map([
			["Bus", RouteType.Bus],
			["BRT", RouteType.Bus],
			["Shuttle", RouteType.Bus],
			["Light Rail", RouteType.LightRail],
			["Commuter Rail", RouteType.CommuterRail],
			["Streetcar", RouteType.StreetCar],
			["Aerial Tram", RouteType.AerialTram],
		]);
		const routeType = mappings.get(subtype);
		assert(routeType, `Unexpected route subtype: '${subtype}'`);
		return routeType;
	}

	private routeDirectionConverter(direction: string): StopDirection | undefined {
		const mappings = new Map([
			["Northbound", StopDirection.Northbound],
			["Southbound", StopDirection.Southbound],
			["Eastbound", StopDirection.Eastbound],
			["Westbound", StopDirection.Westbound],
		]);
		return mappings.get(direction);
	}

	private routeName(subtype: string, id: number, desc: string): string {
		const mappings = new Map([
			["Bus", `${id} Bus`],
			["BRT", `FX${id}`],
			["Streetcar", `${desc.split(" ")[3]} Streetcar`],
		]);
		return mappings.get(subtype) ?? desc;
	}

	async getStops(latitutde: number, longitude: number): Promise<StopService[]> {
		const res = await this.makeRequest<GetStopsResponse>(
			"V1/stops",
			new Map([
				["json", "true"],
				["ll", `${latitutde},${longitude}`],
				["meters", "1600"],
				["showRouteDirs", "true"],
			])
		);
		if ("errorMessage" in res.resultSet) {
			throw new Error(res.resultSet.errorMessage.content);
		}

		const locations = res.resultSet.location ?? [];
		return locations.map((location) => {
			const stop: Stop = {
				id: `${location.locid}`,
				location: location.desc,
				direction: this.routeDirectionConverter(location.dir),
			};
			const routes: Route[] = location.route.flatMap((route) =>
				route.dir.map((dir) => {
					return {
						id: `${route.route}`,
						type: this.routeSubTypeConverter(route.routeSubType),
						name: this.routeName(route.routeSubType, route.route, route.desc),
						destination: dir.desc,
						color: `#${route.routeColor}`,
					};
				})
			);
			return {
				stop,
				routes,
				latitude: location.lat,
				longitude: location.lng,
				distanceMeters: location.metersDistance,
			};
		});
	}

	private arrivalStatusConverter(status: string): ArrivalStatus {
		const mappings = new Map([
			["estimated", ArrivalStatus.Tracked],
			["scheduled", ArrivalStatus.Scheduled],
			["delayed", ArrivalStatus.Delayed],
			["canceled", ArrivalStatus.Cancelled],
		]);
		const arrivalStatus = mappings.get(status);
		assert(arrivalStatus, `Unexpected arrival status: '${status}'`);
		return arrivalStatus;
	}

	async getArrivals(stops: Stop[]): Promise<Map<Stop, Arrival[]>> {
		const result = new Map<Stop, Arrival[]>(stops.map((stop) => [stop, []]));
		const stopsById = new Map<string, Stop>(stops.map((stop) => [stop.id, stop]));

		// We can only request arrival info for up to 128 stops at a time
		const maxRequestableStops = 128;
		for (let i = 0; i < stops.length; i += maxRequestableStops) {
			const locIds = stops.slice(i, i + maxRequestableStops).map((stop) => stop.id);
			const res = await this.makeRequest<GetArrivalsResponse>(
				"V2/arrivals",
				new Map([
					["locIDs", locIds.join(",")],
					["arrivals", "3"],
					["minutes", `60`],
				])
			);
			if ("errorMessage" in res.resultSet) {
				throw new Error(res.resultSet.errorMessage.content);
			}

			for (const arrival of res.resultSet.arrival) {
				const stopId = `${arrival.locid}`;
				const stop = stopsById.get(stopId);
				if (!stop) continue;

				const time = Date.parse(arrival.estimated ?? arrival.scheduled);
				// TODO: handle detours/delays
				result.get(stop)?.push({
					stopId,
					routeId: `${arrival.route}`,
					time,
					status: this.arrivalStatusConverter(arrival.status),
				});
			}
		}

		return result;
	}

	static default(): TriMet {
		const trimetAppId = process.env.TRIMET_APP_ID;
		if (!trimetAppId) {
			console.error("Environment variable 'TRIMET_APP_ID' not found");
			process.exit(1);
		}
		return new TriMet(trimetAppId);
	}
}

export default TriMet;
