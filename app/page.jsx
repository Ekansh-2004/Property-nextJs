import Hero from "@/components/Hero";
import HomeProperties from "@/components/HomeProperties";
import InfoBoxes from "@/components/InfoBoxes";

import connectDB from "@/config/database";

const HomePage = () => {
	connectDB();
	return (
		<>
			<Hero />
			<InfoBoxes />
			<HomeProperties />
		</>
	);
};

export default HomePage;
