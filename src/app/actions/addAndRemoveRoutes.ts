"use server";

import { redirect } from "next/navigation";
import ProfileManager from "@/lib/ProfileManager";
import Route from "@/lib/models/Route";
import Stop from "@/lib/models/Stop";

export async function addAndRemoveRoutes(
	profileId: string,
	routesToAdd: [Stop, Route][],
	routesToRemove: [Stop, Route][]
) {
	const profileManager = await ProfileManager.default();
	const profile = await profileManager.getProfileFromId(profileId);
	if (!profile) {
		redirect("/login");
	}

	// Add new routes
	// TODO: optimize this and support different routes in the same card
	for (const [stop, route] of routesToAdd) {
		const maybeExistingCard = profile.cards.find(
			(card) => card.stop.id === stop.id && card.routes.find((r) => r.id === route.id)
		);
		if (maybeExistingCard) {
			// Idempotency check
			if (!maybeExistingCard.routes.find((r) => r.destination === route.destination)) {
				maybeExistingCard.routes.push(route);
			}
		} else {
			const newCard = {
				stop,
				routes: [route],
			};
			profile.cards.push(newCard);
		}
	}

	// Remove routes and their entire card if necessary
	for (const [stop, route] of routesToRemove) {
		for (const card of profile.cards) {
			if (card.stop.id !== stop.id) {
				continue;
			}
			card.routes = card.routes.filter((r) => r.id !== route.id || r.destination !== route.destination);
		}
	}
	profile.cards = profile.cards.filter((cards) => cards.routes.length > 0);

	// Update the database
	await profileManager.updateCards(profile, profile.cards);

	redirect("/");
}
