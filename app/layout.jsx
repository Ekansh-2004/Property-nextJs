import "@/assets/styles/global.css";

import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";

export const metadata = {
	title: "Property Rental",
};

const MainLayout = ({ children }) => {
	return (
		<html>
			<body>
				<NavBar />
				<main className="text-2xl">{children}</main>
				<Footer />
			</body>
		</html>
	);
};

export default MainLayout;
