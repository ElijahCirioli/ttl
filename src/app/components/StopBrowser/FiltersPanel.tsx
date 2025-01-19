import { RouteType } from "@/lib/models/Route";
import Filter from "@/components/StopBrowser/Filter";
import styles from "./FiltersPanel.module.css";

interface FiltersPanelProps {
	filters: Map<RouteType, boolean>;
	toggleFilter(routeType: RouteType): void;
}

const FiltersPanel: React.FC<FiltersPanelProps> = ({ filters, toggleFilter }: FiltersPanelProps) => {
	return (
		<div id={styles.filtersPanel}>
			<h4>Filter:</h4>
			{Array.from(filters.entries()).map(([routeType, selected]) => (
				<Filter
					key={routeType}
					routeType={routeType}
					isSelected={selected}
					toggleSelection={() => toggleFilter(routeType)}
				/>
			))}
		</div>
	);
};

export default FiltersPanel;
