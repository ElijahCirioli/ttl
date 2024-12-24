import assert from "node:assert";
import { Route, RouteType } from "@/lib/models/Route";
import Stop, { StopDirection } from "@/lib/models/Stop";
import StopService from "@/lib/models/StopService";
import GetStopsResponse from "@/lib/models/trimet/GetStopsResponse";
import TransitService from "./TransitService";

class Trimet implements TransitService {
	private BASE_URL = "https://developer.trimet.org/ws/V1/";

	private appId: string;

	constructor(appId: string) {
		this.appId = appId;
	}

	private async makeRequest<T>(path: string, queryParameters: Map<string, string>): Promise<T> {
		let url = `${this.BASE_URL}${path}?appId=${this.appId}&json=true`;
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
			"stops",
			new Map([
				["ll", `${latitutde},${longitude}`],
				["meters", "1600"],
				["showRouteDirs", "true"],
			])
		);
		return res.resultSet.location.map((location) => {
			const stop: Stop = {
				id: location.locid,
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

	static default(): Trimet {
		const trimetAppId = process.env.TRIMET_APP_ID;
		if (!trimetAppId) {
			console.error("Environment variable 'TRIMET_APP_ID' not found");
			process.exit(1);
		}
		return new Trimet(trimetAppId);
	}
}

export default Trimet;
