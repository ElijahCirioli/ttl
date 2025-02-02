"use client";

import { faPenToSquare, faUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./Header.module.css";

interface HeaderProps {
	showEditButton: boolean;
}

const Header: React.FC<HeaderProps> = ({ showEditButton }: HeaderProps) => {
	const [time, setTime] = useState("");

	useEffect(() => {
		setInterval(() => {
			// TODO: allow for a configurable 24 hour time
			const dateStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
			setTime(dateStr);
		}, 100);
	}, []);

	return (
		<header id={styles.header}>
			<Link id={styles.logoLink} href="/">
				<img id={styles.logo} src="/imgs/logo.png" alt="Time To Leave" />
			</Link>
			<h2 id={styles.clock}>{time}</h2>
			<div id={styles.headerButtons}>
				{showEditButton && (
					<button className={styles.button}>
						<FontAwesomeIcon icon={faPenToSquare} />
					</button>
				)}
				<button className={styles.button}>
					<FontAwesomeIcon icon={faUser} />
				</button>
			</div>
		</header>
	);
};

export default Header;
