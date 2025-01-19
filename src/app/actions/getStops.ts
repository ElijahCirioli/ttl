"use server";

import StopService from "@/lib/models/StopService";
import TriMet from "@/lib/transit/TriMet";

export async function getStops(latitude: number, longitude: number): Promise<StopService[]> {
	const transitService = TriMet.default();
	return transitService.getStops(latitude, longitude);
}
