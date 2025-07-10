import "@/assets/styles/global.css";

import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";

import AuthProvider from "@/components/AuthProvider";

export const metadata = {
	title: "Property Rental",
};

const MainLayout = ({ children }) => {
	return (
		<AuthProvider>
			<html>
				<body>
					<NavBar />
					<main>{children}</main>
					<Footer />
				</body>
			</html>
		</AuthProvider>
	);
};

export default MainLayout;
