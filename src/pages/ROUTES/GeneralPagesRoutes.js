import React from "react";
import { Routes, Route } from "react-router-dom";
import { GuestNavbar } from "../../components/NavbarComponents/TopNavbars";
import Homepage from "../GENERAL_PAGES/Homepage";
import AboutUs from "../GENERAL_PAGES/AboutUs";
import ContactUs from "../GENERAL_PAGES/ContactUs";
import PricingPage from "../GENERAL_PAGES/PricingPage";
import FAQs from "../GENERAL_PAGES/FAQs";
import Error404 from "../GENERAL_PAGES/Error404";

const GeneralPagesRoutes = () => {
	return (
		<Routes>
			<Route element={<GuestNavbar />}>
				<Route path="/" element={<Homepage />} />
				<Route path="aboutus" element={<AboutUs />} />
				<Route path="contactus" element={<ContactUs />} />
				<Route path="pricingpage" element={<PricingPage />} />
				<Route path="faqs" element={<FAQs />} />
				<Route path="*" element={<Error404 />} />
			</Route>
		</Routes>
	);
};

export default GeneralPagesRoutes;
