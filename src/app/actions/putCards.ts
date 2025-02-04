"use server";

import { redirect } from "next/navigation";
import ProfileManager from "@/lib/ProfileManager";
import Card from "@/lib/models/Card";

export async function putCards(profileId: string, newCards: Card[]) {
	const profileManager = await ProfileManager.default();
	const profile = await profileManager.getProfileFromId(profileId);
	if (!profile) {
		redirect("/login");
	}

	await profileManager.updateCards(profile, newCards);

	redirect("/");
}
