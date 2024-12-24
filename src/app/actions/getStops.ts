"use server";

import StopService from "@/lib/models/StopService";
import Trimet from "@/lib/transit/Trimet";

export async function getStops(latitude: number, longitude: number): Promise<StopService[]> {
	const transitService = Trimet.default();
	return transitService.getStops(latitude, longitude);
}
