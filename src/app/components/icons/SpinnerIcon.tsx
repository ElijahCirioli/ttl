import styles from "./SpinnerIcon.module.css";

interface SpinnerIconProps {
	scale: number;
	color: string;
}

// https://cssloaders.github.io/
const SpinnerIcon: React.FC<SpinnerIconProps> = ({ scale, color }: SpinnerIconProps) => {
	return (
		<div
			id={styles.spinnerWrap}
			style={{
				color,
				transform: `scale(${scale})`,
				padding: `${Math.round(50 * scale)}px`,
			}}
		>
			<span id={styles.spinner} />
		</div>
	);
};

export default SpinnerIcon;
