"use server";

import Trimet from "@/lib/transit/Trimet";
import StopService from "@/lib/models/StopService";

export async function getStops(latitude: number, longitude: number): Promise<StopService[]> {
	const transitService = Trimet.default();
	return transitService.getStops(latitude, longitude);
}
