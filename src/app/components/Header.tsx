"use client";

import { faPenToSquare, faUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./Header.module.css";

interface HeaderProps {
	editingState?: EditingState;
}

interface EditingState {
	isEditing: boolean;
	startEditing(): void;
	stopEditing(saveChanges: boolean): void;
}

const Header: React.FC<HeaderProps> = ({ editingState }: HeaderProps) => {
	const [time, setTime] = useState("");

	useEffect(() => {
		setInterval(() => {
			// TODO: allow for a configurable 24 hour time
			const dateStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
			setTime(dateStr);
		}, 100);
	}, []);

	const editButtons = editingState?.isEditing ? (
		<>
			<button className={styles.textButton} onClick={() => editingState.stopEditing(false)}>
				Cancel
			</button>
			<button className={styles.textButton} onClick={() => editingState.stopEditing(true)}>
				Save
			</button>
		</>
	) : (
		<button className={styles.button} onClick={() => editingState?.startEditing()}>
			<FontAwesomeIcon icon={faPenToSquare} />
		</button>
	);

	return (
		<header id={styles.header}>
			<Link id={styles.logoLink} href="/">
				<img id={styles.logo} src="/imgs/logo.png" alt="Time To Leave" />
			</Link>
			<h2 id={styles.clock}>{time}</h2>
			<div id={styles.headerButtons}>
				{editingState && editButtons}
				<button className={styles.button}>
					<FontAwesomeIcon icon={faUser} />
				</button>
			</div>
		</header>
	);
};

export default Header;
