import "@/assets/styles/global.css";

import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";

import AuthProvider from "@/components/AuthProvider";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
					<ToastContainer />
				</body>
			</html>
		</AuthProvider>
	);
};

export default MainLayout;
