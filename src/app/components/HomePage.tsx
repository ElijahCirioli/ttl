"use client";

import { useState } from "react";
import { putCards } from "@/actions/putCards";
import Profile from "@/lib/models/Profile";
import CardViewer from "@/components/CardViewer/CardViewer";
import Header from "@/components/Header";
import styles from "./HomePage.module.css";

interface HomePageProps {
	profile: Profile;
}

const HomePage: React.FC<HomePageProps> = ({ profile }: HomePageProps) => {
	const [isEditing, setisEditing] = useState(false);
	const [editedCards, setEditedCards] = useState(profile.cards);

	function startEditing() {
		setisEditing(true);
	}

	function stopEditing(saveChanges: boolean) {
		if (saveChanges) {
			putCards(profile.id, editedCards);
		}
		setisEditing(false);
	}

	return (
		<>
			<Header editingState={{ isEditing, startEditing, stopEditing }} />
			<main id={styles.main}>
				<CardViewer
					profile={profile}
					isEditing={isEditing}
					editedCards={editedCards}
					setEditedCards={setEditedCards}
				/>
			</main>
		</>
	);
};

export default HomePage;
