"use server";

import { redirect } from "next/navigation";
import ProfileManager from "@/lib/ProfileManager";
import Route from "@/lib/models/Route";
import Stop from "@/lib/models/Stop";

export async function addAndRemoveCards(
	profileId: string,
	cardsToAdd: [Stop, Route][],
	cardsToRemove: [Stop, Route][]
) {
	const profileManager = await ProfileManager.default();
	const profile = await profileManager.getProfileFromId(profileId);
	if (!profile) {
		redirect("/login");
	}

	// Add new routes
	for (const [stop, route] of cardsToAdd) {
		const maybeExistingCard = profile.cards.find((card) => card.stop.id === stop.id && card.route.id === route.id);
		if (!maybeExistingCard) {
			profile.cards.push({
				stop,
				route,
				disambiguationRequired: false,
			});
		}
	}

	// Remove cards if necessary
	profile.cards = profile.cards.filter(
		(card) => !cardsToRemove.find(([stop, route]) => card.stop.id === stop.id && card.route.id === route.id)
	);

	// Recalculate which cards will appear identical and therefore require disambiguation
	Object.values(Object.groupBy(profile.cards, (card) => `${card.stop.location} | ${card.route.name}`)).forEach(
		(identicalCards) => identicalCards?.forEach((card) => (card.disambiguationRequired = identicalCards.length > 1))
	);

	// Update the database
	await profileManager.updateCards(profile, profile.cards);

	redirect("/");
}
