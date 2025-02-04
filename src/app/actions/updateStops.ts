"use server";

import { redirect } from "next/navigation";
import ProfileManager from "@/lib/ProfileManager";
import Card from "@/lib/models/Card";

// TODO: rewrite all of this
export async function updateStops(profileId: string, cardsToAdd: Card[], cardsToRemove: Card[]) {
	const profileManager = await ProfileManager.default();
	const profile = await profileManager.getProfileFromId(profileId);
	if (!profile) {
		redirect("/login");
	}

	// Add new routes to existing cards
	const existingStopIds = new Set();
	const routesToAddByStopId = new Map(cardsToAdd.map((card) => [card.stop.id, card.routes]));
	for (const card of profile.cards) {
		existingStopIds.add(card.stop.id);
		const routesToAdd = routesToAddByStopId.get(card.stop.id);
		if (routesToAdd) {
			card.routes = Array.from(new Set(card.routes.concat(routesToAdd)));
		}
	}

	// Remove routes and their entire card if necessary
	const routeIdsToRemoveByStopId = new Map(
		cardsToRemove.map((card) => [card.stop.id, new Set(card.routes.map((route) => route.id))])
	);

	const filteredCards: Card[] = profile.cards.flatMap((card) => {
		if (!routeIdsToRemoveByStopId.has(card.stop.id)) {
			return [];
		}

		const routeIdsToRemove = routeIdsToRemoveByStopId.get(card.stop.id);
		const filteredRoutes = card.routes.filter((route) => !routeIdsToRemove?.has(route.id));
		return filteredRoutes.length === 0 ? [] : [{ ...card, routes: filteredRoutes }];
	});

	// Add new cards
	for (const card of cardsToAdd) {
		if (existingStopIds.has(card.stop.id)) {
			continue;
		}
	}
	filteredCards.push(...cardsToAdd.filter((card) => !existingStopIds.has(card.stop.id)));

	// Update the database
	await profileManager.updateCards(profile, filteredCards);

	redirect("/");
}
