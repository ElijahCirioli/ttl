import { RouteType } from "@/lib/models/Route";

interface TransitIconProps {
	routeType: RouteType;
	color: string;
	width: number;
}

export const TransitIcon: React.FC<TransitIconProps> = ({ routeType, color, width }: TransitIconProps) => {
	const mappings = {
		[RouteType.Bus]: busIcon,
		[RouteType.StreetCar]: lightRailIcon,
		[RouteType.LightRail]: lightRailIcon,
		[RouteType.Metro]: trainIcon,
		[RouteType.CommuterRail]: trainIcon,
		[RouteType.AerialTram]: aerialTramIcon,
	};

	return (
		<div
			style={{
				color,
				width: `${width}px`,
				height: "auto",
			}}
		>
			{mappings[routeType]}
		</div>
	);
};

const busIcon = (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
		<path
			fill="currentColor"
			d="M288 0C422.4 0 512 35.2 512 80l0 16 0 32c17.7 0 32 14.3 32 32l0 64c0 17.7-14.3 32-32 32l0 160c0 17.7-14.3 32-32 32l0 32c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-32-192 0 0 32c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-32c-17.7 0-32-14.3-32-32l0-160c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32c0 0 0 0 0 0l0-32s0 0 0 0l0-16C64 35.2 153.6 0 288 0zM128 160l0 96c0 17.7 14.3 32 32 32l112 0 0-160-112 0c-17.7 0-32 14.3-32 32zM304 288l112 0c17.7 0 32-14.3 32-32l0-96c0-17.7-14.3-32-32-32l-112 0 0 160zM144 400a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm288 0a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM384 80c0-8.8-7.2-16-16-16L208 64c-8.8 0-16 7.2-16 16s7.2 16 16 16l160 0c8.8 0 16-7.2 16-16z"
		/>
	</svg>
);

const lightRailIcon = (
	<svg
		version="1.1"
		xmlns="http://www.w3.org/2000/svg"
		xmlnsXlink="http://www.w3.org/1999/xlink"
		viewBox="40 0 472 512"
		xmlSpace="preserve"
	>
		<g>
			<path
				fill="currentColor"
				d="M431.665,356.848V147.207c0-48.019-38.916-86.944-86.943-86.944h-40.363l4.812-42.824h8.813
		c9.435,0,17.508,5.74,20.965,13.898l16.06-6.779V24.55C348.929,10.124,334.641,0.018,317.984,0L193.999,0.009
		c-16.639,0.009-30.928,10.116-37.016,24.541l16.06,6.796c3.466-8.166,11.539-13.906,20.956-13.897h8.823l4.81,42.815h-40.354
		c-48.01,0-86.942,38.924-86.942,86.944v209.641c0,36.403,26.483,66.736,61.208,72.773L87.011,512h48.488l22.378-33.823h196.264
		L376.519,512h48.47l-54.516-82.379C405.182,423.576,431.665,393.252,431.665,356.848z M291.621,17.44l-4.803,42.824h-61.635
		l-4.819-42.815L291.621,17.44z M180.715,99.299h150.57v25.095h-150.57V99.299z M135.413,180.409
		c0-10.917,8.839-19.773,19.756-19.773h201.664c10.916,0,19.773,8.856,19.773,19.773v65.96c0,10.917-8.857,19.764-19.773,19.764
		H155.168c-10.916,0-19.756-8.847-19.756-19.764V180.409z M154.232,378.495c-12.739,0-23.06-10.321-23.06-23.043
		c0-12.739,10.321-23.052,23.06-23.052c12.722,0,23.043,10.313,23.043,23.052C177.275,368.174,166.954,378.495,154.232,378.495z
		 M172.421,456.19l16.844-25.461h133.471l16.844,25.461H172.421z M357.768,378.495c-12.722,0-23.043-10.321-23.043-23.043
		c0-12.739,10.321-23.052,23.043-23.052c12.739,0,23.06,10.313,23.06,23.052C380.828,368.174,370.507,378.495,357.768,378.495z"
			/>
		</g>
	</svg>
);

const trainIcon = (
	<svg
		version="1.1"
		xmlns="http://www.w3.org/2000/svg"
		xmlnsXlink="http://www.w3.org/1999/xlink"
		viewBox="0 0 512 512"
		xmlSpace="preserve"
	>
		<g>
			<path
				fill="currentColor"
				d="M437.575,351.629V89.868C437.575,40.233,397.351,0,347.707,0H164.293c-49.625,0-89.868,40.233-89.868,89.868
		v261.761c0,37.628,27.383,68.98,63.269,75.221L81.334,512h50.11l23.132-34.961h202.867L380.574,512h50.101l-56.35-85.15
		C410.201,420.601,437.575,389.257,437.575,351.629z M178.182,40.348h155.636v25.94H178.182V40.348z M131.355,124.186
		c0-11.284,9.137-20.438,20.421-20.438h208.456c11.276,0,20.429,9.154,20.429,20.438v86.206c0,11.284-9.154,20.429-20.429,20.429
		H151.777c-11.284,0-20.421-9.145-20.421-20.429V124.186z M150.808,374.004c-13.158,0-23.826-10.668-23.826-23.818
		c0-13.167,10.668-23.836,23.826-23.836c13.159,0,23.827,10.668,23.827,23.836C174.635,363.336,163.967,374.004,150.808,374.004z
		 M169.618,454.312l17.41-26.318h137.953l17.41,26.318H169.618z M361.201,374.004c-13.158,0-23.826-10.668-23.826-23.818
		c0-13.167,10.668-23.836,23.826-23.836c13.159,0,23.827,10.668,23.827,23.836C385.028,363.336,374.36,374.004,361.201,374.004z"
			/>
		</g>
	</svg>
);

const aerialTramIcon = (
	<svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="40 0 472 512">
		<g>
			<path
				fill="currentColor"
				d="M 180.003 210.837 L 334.602 210.837 C 381.371 210.837 419.284 248.75 419.284 295.519 L 419.284 368.476 C 419.284 415.245 381.371 453.158 334.602 453.158 L 180.003 453.158 C 133.234 453.158 95.321 415.245 95.321 368.476 L 95.321 295.519 C 95.321 248.75 133.234 210.837 180.003 210.837 Z M 121.595 283.913 L 121.595 350.79 C 121.595 362.302 130.928 371.635 142.44 371.635 L 179.352 371.635 C 190.864 371.635 200.197 362.302 200.197 350.79 L 200.197 283.913 C 200.197 272.401 190.864 263.068 179.352 263.068 L 142.44 263.068 C 130.928 263.068 121.595 272.401 121.595 283.913 Z M 218.002 283.913 L 218.002 350.79 C 218.002 362.302 227.335 371.635 238.847 371.635 L 275.759 371.635 C 287.271 371.635 296.604 362.302 296.604 350.79 L 296.604 283.913 C 296.604 272.401 287.271 263.068 275.759 263.068 L 238.847 263.068 C 227.335 263.068 218.002 272.401 218.002 283.913 Z M 314.409 283.913 L 314.409 350.79 C 314.409 362.302 323.742 371.635 335.254 371.635 L 372.166 371.635 C 383.678 371.635 393.011 362.302 393.011 350.79 L 393.011 283.913 C 393.011 272.401 383.678 263.068 372.166 263.068 L 335.254 263.068 C 323.742 263.068 314.409 272.401 314.409 283.913 Z M 56.712 140.204 L 431.239 46.824 C 437.755 45.199 444.355 49.164 445.98 55.68 C 447.604 62.196 443.639 68.796 437.123 70.421 L 62.595 163.801 C 56.079 165.425 49.479 161.46 47.855 154.944 C 46.231 148.428 50.196 141.829 56.712 140.204 Z M 245.765 134.172 L 267.971 134.172 C 275.64610116839856 134.172 281.868 140.39389883160146 281.868 148.069 L 281.868 221.025 C 281.868 228.70010116839853 275.64610116839856 234.922 267.971 234.922 L 245.765 234.922 C 238.08989883160146 234.922 231.868 228.70010116839853 231.868 221.025 L 231.868 148.069 C 231.868 140.39389883160146 238.08989883160146 134.172 245.765 134.172 Z M 180.922 67.283 L 298.305 38.017 C 304.533 36.464 310.84 40.254 312.393 46.482 L 313.877 52.433 C 315.43 58.661 311.64 64.968 305.412 66.521 L 188.029 95.788 C 181.801 97.341 175.494 93.551 173.941 87.323 L 172.457 81.372 C 170.904 75.144 174.694 68.836 180.922 67.283 Z"
			/>
		</g>
	</svg>
);
