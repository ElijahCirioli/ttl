"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./ScrollingText.module.css";

interface ScrollingTextProps {
	text: string;
}

const ScrollingText: React.FC<ScrollingTextProps> = ({ text }: ScrollingTextProps) => {
	const wrappingRef = useRef<HTMLDivElement | null>(null);
	const measuringRef = useRef<HTMLParagraphElement | null>(null);
	const [width, setWidth] = useState(0);
	const [textWidth, setTextWidth] = useState(0);

	useEffect(() => {
		if (measuringRef.current && wrappingRef.current) {
			setWidth(wrappingRef.current.offsetWidth);
			setTextWidth(measuringRef.current.offsetWidth);
		}
	}, [text]);

	return (
		<div className={styles.textWrap} ref={wrappingRef}>
			<p className={styles.measuringText} ref={measuringRef}>
				{text}
			</p>
			{textWidth <= width ? (
				<p className={styles.staticText} ref={measuringRef}>
					{text}
				</p>
			) : (
				<div className={styles.scrollingText}>
					<p>{text}</p>
					<p>{text}</p>
				</div>
			)}
		</div>
	);
};

export default ScrollingText;
