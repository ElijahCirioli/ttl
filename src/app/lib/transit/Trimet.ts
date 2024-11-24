import TransitService from "./TransitService";
import StopService from "@/lib/models/StopService";

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

	async getStops(latitutde: number, longitude: number): Promise<StopService[]> {
		const res = await this.makeRequest<object>(
			"stops",
			new Map([
				["ll", `${latitutde},${longitude}`],
				["meters", "1000"],
			])
		);
		console.log(res);
		return [];
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
