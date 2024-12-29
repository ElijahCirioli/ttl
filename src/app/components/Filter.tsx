import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RouteType } from "@/lib/models/Route";
import TransitIcon from "@/components/icons/TransitIcon";
import styles from "./Filter.module.css";

interface FilterProps {
	routeType: RouteType;
	isSelected: boolean;
	toggleSelection(): void;
}

const Filter: React.FC<FilterProps> = ({ routeType, isSelected, toggleSelection }: FilterProps) => {
	return (
		<div className={styles.filter}>
			<div className={styles.iconWrap} onClick={toggleSelection}>
				<TransitIcon
					routeType={routeType}
					width={42}
					color={isSelected ? "var(--black-color)" : "var(--dark-gray-color)"}
				/>
				<button className={`${styles.checkBox} ${isSelected ? styles.checked : ""}`}>
					<span className={styles.checkMark}>
						<FontAwesomeIcon icon={faCheck} />
					</span>
				</button>
			</div>
			<label className={styles.filterType}>{routeType}</label>
		</div>
	);
};

export default Filter;
