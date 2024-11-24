import Trimet from "@/lib/transit/Trimet";

export default async function Home() {
	const trimet = Trimet.default();
	return <p>Failed to get stops from TriMet</p>;
}
